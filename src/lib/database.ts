import sqlite3 from 'sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the root directory for DB and uploads exists
const rootDir = join(__dirname, '../../');
const uploadsDir = join(rootDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Database path — configurable via DATABASE_PATH env var for persistent disk on Render/Railway
const dbPath = process.env.DATABASE_PATH || join(rootDir, 'app.db');
const dbDir = dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to local SQLite file
export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log(`Connected to SQLite database at ${dbPath}`);
        db.run('PRAGMA journal_mode = WAL');
    }
});

// Helper for promise-based queries
export const dbQuery = (sql: string, params: any[] = []): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export const dbGet = (sql: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const dbRun = (sql: string, params: any[] = []): Promise<sqlite3.RunResult> => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};


// Initialize database schema
export async function initDb() {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT DEFAULT 'CUSTOMER',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                slug TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                market_price REAL,
                original_price REAL,
                carat REAL NOT NULL,
                cut TEXT,
                color TEXT,
                clarity TEXT,
                shape TEXT,
                description TEXT,
                in_stock BOOLEAN DEFAULT 1,
                is_new BOOLEAN DEFAULT 1,
                sale BOOLEAN DEFAULT 0,
                cert_lab TEXT,
                cert_number TEXT,
                cert_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS product_images (
                id TEXT PRIMARY KEY,
                product_id TEXT NOT NULL,
                url TEXT NOT NULL,
                sort_order INTEGER DEFAULT 0,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                order_number TEXT UNIQUE NOT NULL,
                user_id TEXT,
                email TEXT NOT NULL,
                phone TEXT,
                status TEXT DEFAULT 'PENDING',
                total_price REAL NOT NULL,
                shipping_fullname TEXT,
                shipping_street TEXT,
                shipping_city TEXT,
                shipping_state TEXT,
                shipping_postal TEXT,
                shipping_country TEXT,
                tracking_number TEXT,
                courier TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS order_items (
                id TEXT PRIMARY KEY,
                order_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                image TEXT,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS order_updates (
                id TEXT PRIMARY KEY,
                order_id TEXT NOT NULL,
                status TEXT NOT NULL,
                message TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS reviews (
                id TEXT PRIMARY KEY,
                product_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                author_name TEXT NOT NULL,
                rating INTEGER NOT NULL,
                comment TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS addresses (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                full_name TEXT NOT NULL,
                street_address TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                postal_code TEXT NOT NULL,
                country TEXT NOT NULL,
                is_default BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

// Helper to seed data if empty
export async function seedDb() {
    try {
        const row = await dbGet('SELECT COUNT(*) as count FROM products');
        if (row && row.count === 0) {
            console.log("Seeding initial products...");
            
            const insertProduct = `
                INSERT INTO products (id, slug, name, price, carat, cut, color, clarity, shape, description, cert_lab)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const insertImage = `
                INSERT INTO product_images (id, product_id, url) VALUES (?, ?, ?)
            `;

            const id1 = crypto.randomUUID();
            await dbRun(insertProduct, [id1, 'luminary-round', 'The Luminary', 12500, 1.5, 'Ideal', 'D', 'VVS1', 'Round', 'A perfectly cut round brilliant diamond.', 'GIA']);
            await dbRun(insertImage, [crypto.randomUUID(), id1, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop']);

            const id2 = crypto.randomUUID();
            await dbRun(insertProduct, [id2, 'aethelgard-emerald', 'Aethelgard Emerald', 28000, 3.2, 'Excellent', 'E', 'VVS2', 'Emerald', 'Stunning emerald cut.', 'GIA']);
            await dbRun(insertImage, [crypto.randomUUID(), id2, 'https://images.unsplash.com/photo-1598560917505-59a3ad55934d?q=80&w=800&auto=format&fit=crop']);

            const id3 = crypto.randomUUID();
            await dbRun(insertProduct, [id3, 'solstice-cushion', 'Solstice Cushion', 8900, 1.2, 'Excellent', 'F', 'VS1', 'Cushion', 'Beautiful cushion cut.', 'AGS']);
            await dbRun(insertImage, [crypto.randomUUID(), id3, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop']);
            
            console.log("Seeding complete.");
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

