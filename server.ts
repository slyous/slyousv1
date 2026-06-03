import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { initDb, seedDb, dbQuery, dbGet, dbRun, db } from './src/lib/database.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_production';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'slyous@proton.me';

// --- Helper: generate JWT ---
function generateToken(user: { id: string; email: string; name: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  const PORT = process.env.PORT || 3000;

  // --- Initialize Database ---
  await initDb();
  await seedDb();

  // --- Middleware ---
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(express.json());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use('/api', limiter);

  // --- Auth Middleware ---
  const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split('Bearer ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  const adminOnly = (req: any, res: any, next: any) => {
    if (req.user?.email !== ADMIN_EMAIL && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };

  // ===========================
  //       AUTH ROUTES
  // ===========================

  // Register
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const id = crypto.randomUUID();
      const passwordHash = await bcrypt.hash(password, 12);
      const role = email === ADMIN_EMAIL ? 'ADMIN' : 'CUSTOMER';

      await dbRun(
        'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)',
        [id, email, passwordHash, name, role]
      );

      const user = { id, email, name, role };
      const token = generateToken(user);
      res.status(201).json({ token, user });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Get current user
  app.get('/api/auth/me', authenticate, async (req: any, res) => {
    try {
      const user = await dbGet('SELECT id, email, name, role FROM users WHERE id = ?', [req.user.id]);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  // ===========================
  //      PRODUCT ROUTES
  // ===========================

  // Get all products (with images joined)
  app.get('/api/products', async (req, res) => {
    try {
      const limitVal = req.query.limit ? parseInt(req.query.limit as string) : null;
      let products;
      if (limitVal) {
        products = await dbQuery('SELECT * FROM products ORDER BY created_at DESC LIMIT ?', [limitVal]);
      } else {
        products = await dbQuery('SELECT * FROM products ORDER BY created_at DESC');
      }

      // Attach images to each product
      for (const p of products) {
        const images = await dbQuery('SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order', [p.id]);
        p.images = images.map((i: any) => i.url);
      }

      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Get single product by slug
  app.get('/api/products/:slugOrId', async (req, res) => {
    try {
      const param = req.params.slugOrId;
      let product = await dbGet('SELECT * FROM products WHERE slug = ?', [param]);
      if (!product) {
        product = await dbGet('SELECT * FROM products WHERE id = ?', [param]);
      }
      if (!product) return res.status(404).json({ error: 'Product not found' });

      const images = await dbQuery('SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order', [product.id]);
      product.images = images.map((i: any) => i.url);

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  // Create product (admin)
  app.post('/api/products', authenticate, adminOnly, async (req: any, res) => {
    try {
      const { name, slug, price, carat, cut, color, clarity, shape, description, cert_lab, cert_number, cert_url, images, in_stock, is_new, sale, market_price, original_price } = req.body;
      const id = crypto.randomUUID();
      const productSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      await dbRun(
        `INSERT INTO products (id, slug, name, price, carat, cut, color, clarity, shape, description, cert_lab, cert_number, cert_url, in_stock, is_new, sale, market_price, original_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, productSlug, name, price, carat, cut, color, clarity, shape, description, cert_lab, cert_number, cert_url, in_stock ?? 1, is_new ?? 1, sale ?? 0, market_price, original_price]
      );

      if (images && Array.isArray(images)) {
        for (let i = 0; i < images.length; i++) {
          await dbRun('INSERT INTO product_images (id, product_id, url, sort_order) VALUES (?, ?, ?, ?)', [crypto.randomUUID(), id, images[i], i]);
        }
      }

      const created = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
      const imgs = await dbQuery('SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order', [id]);
      created.images = imgs.map((i: any) => i.url);
      res.status(201).json(created);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Update product (admin)
  app.put('/api/products/:id', authenticate, adminOnly, async (req: any, res) => {
    try {
      const { name, slug, price, carat, cut, color, clarity, shape, description, cert_lab, cert_number, cert_url, images, in_stock, is_new, sale, market_price, original_price } = req.body;
      const productId = req.params.id;

      await dbRun(
        `UPDATE products SET name=?, slug=?, price=?, carat=?, cut=?, color=?, clarity=?, shape=?, description=?, cert_lab=?, cert_number=?, cert_url=?, in_stock=?, is_new=?, sale=?, market_price=?, original_price=? WHERE id=?`,
        [name, slug, price, carat, cut, color, clarity, shape, description, cert_lab, cert_number, cert_url, in_stock, is_new, sale, market_price, original_price, productId]
      );

      if (images && Array.isArray(images)) {
        await dbRun('DELETE FROM product_images WHERE product_id = ?', [productId]);
        for (let i = 0; i < images.length; i++) {
          await dbRun('INSERT INTO product_images (id, product_id, url, sort_order) VALUES (?, ?, ?, ?)', [crypto.randomUUID(), productId, images[i], i]);
        }
      }

      const updated = await dbGet('SELECT * FROM products WHERE id = ?', [productId]);
      const imgs = await dbQuery('SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order', [productId]);
      updated.images = imgs.map((i: any) => i.url);
      res.json(updated);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  // Delete product (admin)
  app.delete('/api/products/:id', authenticate, adminOnly, async (req: any, res) => {
    try {
      await dbRun('DELETE FROM products WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // ===========================
  //      REVIEW ROUTES
  // ===========================

  app.get('/api/products/:productId/reviews', async (req, res) => {
    try {
      const reviews = await dbQuery(
        'SELECT r.id, r.product_id, r.user_id, r.author_name as authorName, r.rating, r.comment, r.created_at FROM reviews r WHERE r.product_id = ? ORDER BY r.created_at DESC',
        [req.params.productId]
      );
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.post('/api/products/:productId/reviews', authenticate, async (req: any, res) => {
    try {
      const { rating, comment } = req.body;
      const id = crypto.randomUUID();
      await dbRun(
        'INSERT INTO reviews (id, product_id, user_id, author_name, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
        [id, req.params.productId, req.user.id, req.user.name, rating, comment]
      );
      const review = await dbGet('SELECT id, product_id, user_id, author_name as authorName, rating, comment, created_at FROM reviews WHERE id = ?', [id]);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  // ===========================
  //      ORDER ROUTES
  // ===========================

  // Create order
  app.post('/api/orders', authenticate, async (req: any, res) => {
    try {
      const { items, totalPrice, shipping, phone, paymentMethod } = req.body;
      const id = crypto.randomUUID();
      const orderNumber = 'VEL-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

      await dbRun(
        `INSERT INTO orders (id, order_number, user_id, email, phone, status, total_price, shipping_fullname, shipping_street, shipping_city, shipping_state, shipping_postal, shipping_country)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, orderNumber, req.user.id, req.user.email, phone || '', 'PENDING', totalPrice,
         shipping?.fullName, shipping?.street, shipping?.city, shipping?.state, shipping?.postalCode, shipping?.country]
      );

      // Insert order items
      if (items && Array.isArray(items)) {
        for (const item of items) {
          await dbRun(
            'INSERT INTO order_items (id, order_id, product_id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [crypto.randomUUID(), id, item.id, item.name, item.price, item.quantity || 1, item.images?.[0] || '']
          );
        }
      }

      // Initial order update
      await dbRun(
        'INSERT INTO order_updates (id, order_id, status, message) VALUES (?, ?, ?, ?)',
        [crypto.randomUUID(), id, 'PENDING', 'Order placed successfully']
      );

      res.status(201).json({ orderId: id, orderNumber });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // Get user's orders
  app.get('/api/orders', authenticate, async (req: any, res) => {
    try {
      const orders = await dbQuery('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
      for (const order of orders) {
        order.items = await dbQuery('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        order.updates = await dbQuery('SELECT * FROM order_updates WHERE order_id = ? ORDER BY created_at DESC', [order.id]);
      }
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Get single order (by id or orderNumber)
  app.get('/api/orders/:idOrNumber', async (req, res) => {
    try {
      const param = req.params.idOrNumber;
      let order = await dbGet('SELECT * FROM orders WHERE id = ? OR order_number = ?', [param, param]);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      order.items = await dbQuery('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.updates = await dbQuery('SELECT * FROM order_updates WHERE order_id = ? ORDER BY created_at DESC', [order.id]);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  // Update order status (admin or customer for confirming payment)
  app.put('/api/orders/:id/status', authenticate, async (req: any, res) => {
    try {
      const { status, message, trackingNumber, courier } = req.body;
      const orderId = req.params.id;

      const order = await dbGet('SELECT * FROM orders WHERE id = ?', [orderId]);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      const isAdmin = req.user?.email === ADMIN_EMAIL || req.user?.role === 'ADMIN';
      const isOwner = order.user_id === req.user.id;

      if (!isAdmin) {
        if (!isOwner) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        if (status !== 'PENDING_CONFIRMATION') {
          return res.status(403).json({ error: 'Customers can only confirm payment' });
        }
      }

      let updateSql = 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP';
      const params: any[] = [status];
      if (trackingNumber) { updateSql += ', tracking_number = ?'; params.push(trackingNumber); }
      if (courier) { updateSql += ', courier = ?'; params.push(courier); }
      updateSql += ' WHERE id = ?';
      params.push(orderId);
      await dbRun(updateSql, params);

      await dbRun(
        'INSERT INTO order_updates (id, order_id, status, message) VALUES (?, ?, ?, ?)',
        [crypto.randomUUID(), orderId, status, message || `Status updated to ${status}`]
      );

      const updated = await dbGet('SELECT * FROM orders WHERE id = ?', [orderId]);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  // ===========================
  //     ADDRESS ROUTES
  // ===========================

  app.get('/api/addresses', authenticate, async (req: any, res) => {
    try {
      const addresses = await dbQuery('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC', [req.user.id]);
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch addresses' });
    }
  });

  app.post('/api/addresses', authenticate, async (req: any, res) => {
    try {
      const { full_name, street_address, city, state, postal_code, country, is_default } = req.body;
      const id = crypto.randomUUID();

      if (is_default) {
        await dbRun('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
      }

      await dbRun(
        'INSERT INTO addresses (id, user_id, full_name, street_address, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, req.user.id, full_name, street_address, city, state, postal_code, country, is_default ? 1 : 0]
      );

      const address = await dbGet('SELECT * FROM addresses WHERE id = ?', [id]);
      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create address' });
    }
  });

  app.delete('/api/addresses/:id', authenticate, async (req: any, res) => {
    try {
      await dbRun('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete address' });
    }
  });

  // ===========================
  //     ADMIN DASHBOARD
  // ===========================

  app.get('/api/admin/dashboard', authenticate, adminOnly, async (req, res) => {
    try {
      const orderCount = await dbGet('SELECT COUNT(*) as count FROM orders');
      const productCount = await dbGet('SELECT COUNT(*) as count FROM products');
      const totalRevenue = await dbGet('SELECT COALESCE(SUM(total_price), 0) as total FROM orders');
      const recentOrders = await dbQuery('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');

      res.json({
        orderCount: orderCount?.count || 0,
        productCount: productCount?.count || 0,
        totalRevenue: totalRevenue?.total || 0,
        recentOrders,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Admin: get all orders
  app.get('/api/admin/orders', authenticate, adminOnly, async (req, res) => {
    try {
      const orders = await dbQuery('SELECT * FROM orders ORDER BY created_at DESC');
      for (const order of orders) {
        order.items = await dbQuery('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        order.updates = await dbQuery('SELECT * FROM order_updates WHERE order_id = ? ORDER BY created_at DESC', [order.id]);
      }
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // ===========================
  //       EMAIL ROUTE
  // ===========================

  app.post('/api/send-email', authenticate, async (req: any, res) => {
    try {
      const { to, subject, text, html } = req.body;

      if (!process.env.SMTP_HOST) {
        console.log('--- MOCK EMAIL SENT ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Text: ${text}`);
        console.log('-----------------------');
        return res.json({ success: true, message: 'Mock email sent (configure SMTP_HOST to send real emails)' });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Veloura Diamonds" <noreply@veloura.com>',
        to,
        subject,
        text,
        html: html || text,
      });

      console.log('Email sent: %s', info.messageId);
      res.json({ success: true, messageId: info.messageId });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`${signal} signal received: closing HTTP server`);
    server.close(() => {
      console.log('HTTP server closed');
      db.close((err) => {
        if (err) {
          console.error('Error closing database', err);
          process.exit(1);
        }
        console.log('Database connection closed');
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
