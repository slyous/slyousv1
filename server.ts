import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

// Initialize Firebase Admin
// In this environment, it will pick up credentials if properly configured, 
// otherwise we might need a service account JSON.
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  const PORT = 3000;

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for dev/iframe compatibility
  }));
  app.use(cors());
  app.use(express.json());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use('/api', limiter);

  // --- API ROUTES ---

  // Auth Middleware
  const authenticate = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  const adminOnly = (req: any, res: any, next: any) => {
    if (req.user?.email !== 'abbahabdulsalam1@gmail.com') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };

  // Email API
  app.post('/api/send-email', async (req, res) => {
    try {
      const { to, subject, text, html } = req.body;
      
      // If we don't have SMTP configured, we just log it and simulate success
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
        from: process.env.SMTP_FROM || '"Vellandi Diamonds" <noreply@vellandi.com>',
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

  // Products API
  app.get('/api/products', async (req, res) => {
    try {
      const snapshot = await db.collection('products').get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Orders API
  app.post('/api/orders', authenticate, async (req: any, res) => {
    try {
      const orderData = {
        ...req.body,
        userId: req.user.uid,
        email: req.user.email,
        status: 'PENDING',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      const docRef = await db.collection('orders').add(orderData);
      
      // Add initial update
      await db.collection('orders').doc(docRef.id).collection('updates').add({
        status: 'PENDING',
        message: 'Order placed successfully',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(201).json({ orderId: docRef.id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // Admin Dashboard API
  app.get('/api/admin/dashboard', authenticate, adminOnly, async (req, res) => {
    try {
      const ordersSnapshot = await db.collection('orders').get();
      const productsSnapshot = await db.collection('products').get();
      
      const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalPrice || 0), 0);
      
      res.json({
        orderCount: ordersSnapshot.size,
        productCount: productsSnapshot.size,
        totalRevenue,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Seed initial products if none exist
  async function seedProducts() {
    const snapshot = await db.collection('products').limit(1).get();
    if (snapshot.empty) {
      console.log('Seeding initial products...');
      const initialProducts = [
        {
          name: 'The Celestial Radiant',
          slug: 'celestial-radiant',
          price: 125000,
          carat: 4.5,
          color: 'D',
          clarity: 'IF',
          cut: 'Excellent',
          shape: 'Radiant',
          images: ['https://images.unsplash.com/photo-1549468057-5b64301ba6c7?auto=format&fit=crop&q=80&w=1200'],
          description: 'A masterpiece of light and precision.',
          inStock: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }
      ];
      for (const p of initialProducts) {
        await db.collection('products').add(p);
      }
    }
  }
  seedProducts().catch(console.error);

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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
