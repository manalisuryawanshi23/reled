import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { pool } from './db';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_ledprisha_jwt_key_2026';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ledprisha.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword';
const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000000'; // Static UUID for admin user

app.use(cors());
app.use(express.json());

// =================================================================
// DATABASE BOOTSTRAP: Load schema if settings table doesn't exist
// =================================================================
async function bootstrapDatabase() {
  try {
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'settings'
      );
    `);

    const settingsExists = tableCheck.rows[0].exists;
    if (!settingsExists) {
      console.log('Database tables not found. Bootstrapping from database_backup.sql...');
      const sqlPath = path.join(__dirname, '../../database_backup.sql');
      if (fs.existsSync(sqlPath)) {
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        await pool.query(sqlContent);
        console.log('Database successfully bootstrapped and seeded with sample data.');
      } else {
        console.error('Could not find database_backup.sql file at:', sqlPath);
      }
    } else {
      console.log('Database tables verified. Settings table is present.');
    }
  } catch (error: any) {
    console.error('Failed to bootstrap database:', error.message);
  }
}

// =================================================================
// AUTHENTICATION MIDDLEWARE
// =================================================================
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    (req as any).user = decoded;
    next();
  });
}
// Middleware to protect administrative routes (POST, PUT, DELETE)
// Public actions like GET, and submitting enquiries (POST /api/enquiries) are allowed.
app.use('/api/:table', (req: Request, res: Response, next: NextFunction) => {
  const { table } = req.params;
  
  // Allow auth actions to bypass this table check
  if (table === 'auth') {
    return next();
  }

  const isPublicGet = req.method === 'GET';
  const isPublicEnquiry = req.method === 'POST' && table === 'enquiries';

  if (isPublicGet || isPublicEnquiry) {
    return next();
  }

  // Admin writes must be authenticated
  authenticateToken(req, res, next);
});
// =================================================================
// AUTHENTICATION ENDPOINTS (Supabase GoTrue Equivalents)
// =================================================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Generate JWT
    const token = jwt.sign({ userId: ADMIN_USER_ID, email }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({
      session: {
        access_token: token,
        token_type: 'bearer',
        expires_in: 86400,
        user: {
          id: ADMIN_USER_ID,
          email: ADMIN_EMAIL,
          created_at: new Date().toISOString(),
        }
      },
      error: null
    });
  }

  return res.status(400).json({
    session: null,
    error: { message: 'Invalid login credentials' }
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  return res.json({ error: null });
});

// Helper for JWT validation check
app.get('/api/auth/session', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.json({ session: null, error: null });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.json({ session: null, error: null });
    }
    return res.json({
      session: {
        access_token: token,
        user: {
          id: ADMIN_USER_ID,
          email: ADMIN_EMAIL,
        }
      },
      error: null
    });
  });
});

// =================================================================
// CORE API CRUD ENDPOINTS
// =================================================================

// GET: Query table items
app.get('/api/:table', async (req: Request, res: Response) => {
  const { table } = req.params;
  const { id, select, order, single, ...filters } = req.query;

  // List of valid database tables
  const allowedTables = [
    'settings', 'categories', 'subcategories', 'products', 
    'sectors', 'gallery', 'testimonials', 'faqs', 'catalogues', 
    'enquiries', 'team_members'
  ];

  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: `Table '${table}' not found or restricted.` });
  }

  try {
    let queryText = '';
    const queryParams: any[] = [];

    // Custom Join Resolvers to mimic Supabase relation loads
    if (table === 'products') {
      queryText = `
        SELECT p.*,
          COALESCE(
            json_build_object('id', c.id, 'name', c.name, 'slug', c.slug), 
            NULL
          ) as category,
          COALESCE(
            json_build_object('id', s.id, 'name', s.name, 'slug', s.slug), 
            NULL
          ) as subcategory
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN subcategories s ON p.subcategory_id = s.id
        WHERE 1=1
      `;
    } else if (table === 'subcategories') {
      queryText = `
        SELECT s.*,
          COALESCE(
            json_build_object('id', c.id, 'name', c.name), 
            NULL
          ) as category,
          COALESCE(
            json_build_object('id', ps.id, 'name', ps.name), 
            NULL
          ) as parent
        FROM subcategories s
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN subcategories ps ON s.parent_id = ps.id
        WHERE 1=1
      `;
    } else {
      queryText = `SELECT * FROM ${table} WHERE 1=1`;
    }

    // Apply filters
    let paramIndex = 1;
    if (id) {
      queryText += ` AND ${table === 'products' ? 'p' : table === 'subcategories' ? 's' : table}.id = $${paramIndex++}`;
      queryParams.push(id);
    }

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        // Resolve field table qualifiers for joins
        const colQualifier = (table === 'products' && (key === 'category_id' || key === 'subcategory_id' || key === 'status'))
          ? `p.${key}` 
          : (table === 'subcategories' && (key === 'category_id' || key === 'parent_id' || key === 'is_active'))
            ? `s.${key}`
            : key;
            
        if (value === 'null') {
          queryText += ` AND ${colQualifier} IS NULL`;
        } else if (value === 'not.null') {
          queryText += ` AND ${colQualifier} IS NOT NULL`;
        } else {
          queryText += ` AND ${colQualifier} = $${paramIndex++}`;
          queryParams.push(value);
        }
      }
    }

    // Apply ordering
    if (order) {
      const orderStr = order as string;
      const [col, dir] = orderStr.split(':');
      const cleanCol = (table === 'products' && col === 'created_at') ? 'p.created_at' : col;
      queryText += ` ORDER BY ${cleanCol} ${dir === 'desc' ? 'DESC' : 'ASC'}`;
    }

    const dbRes = await pool.query(queryText, queryParams);

    if (single === 'true') {
      return res.json(dbRes.rows[0] || null);
    }

    return res.json(dbRes.rows);
  } catch (error: any) {
    console.error(`Error querying table ${table}:`, error.message);
    return res.status(500).json({ error: error.message });
  }
});

// POST: Insert a new row
app.post('/api/:table', async (req: Request, res: Response) => {
  const { table } = req.params;
  const payload = req.body;

  try {
    const keys = Object.keys(payload);
    const values = Object.values(payload);

    if (keys.length === 0) {
      return res.status(400).json({ error: 'Cannot insert an empty object' });
    }

    const cols = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    // Convert JS arrays to PostgreSQL arrays if necessary (e.g. products.images)
    const processedValues = values.map((val, idx) => {
      const colName = keys[idx];
      if (Array.isArray(val)) {
        if (table === 'products' && colName === 'images') {
          // Standard text array mapping
          return val; // pg-pool driver handles native JS arrays as PG arrays automatically!
        }
        return JSON.stringify(val);
      }
      return val;
    });

    const queryText = `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) RETURNING *`;
    const dbRes = await pool.query(queryText, processedValues);
    
    return res.json(dbRes.rows[0]);
  } catch (error: any) {
    console.error(`Error inserting into table ${table}:`, error.message);
    return res.status(500).json({ error: error.message });
  }
});

// PUT: Update a row
app.put('/api/:table', async (req: Request, res: Response) => {
  const { table } = req.params;
  const { id } = req.query; // Expect ?id=UUID
  const payload = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Query parameter ?id=UUID is required for updates' });
  }

  try {
    const keys = Object.keys(payload);
    const values = Object.values(payload);

    if (keys.length === 0) {
      return res.status(400).json({ error: 'Cannot update with an empty object' });
    }

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    // Process values (similar array / object formatting)
    const processedValues = values.map((val, idx) => {
      const colName = keys[idx];
      if (Array.isArray(val)) {
        if (table === 'products' && colName === 'images') {
          return val;
        }
        return JSON.stringify(val);
      }
      return val;
    });

    processedValues.push(id as string);
    const queryText = `UPDATE ${table} SET ${setClause} WHERE id = $${processedValues.length} RETURNING *`;
    
    const dbRes = await pool.query(queryText, processedValues);

    if (dbRes.rowCount === 0) {
      return res.status(404).json({ error: `Row not found in ${table} with id ${id}` });
    }

    return res.json(dbRes.rows[0]);
  } catch (error: any) {
    console.error(`Error updating table ${table}:`, error.message);
    return res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove a row
app.delete('/api/:table', async (req: Request, res: Response) => {
  const { table } = req.params;
  const { id } = req.query; // Expect ?id=UUID

  if (!id) {
    return res.status(400).json({ error: 'Query parameter ?id=UUID is required for deletion' });
  }

  try {
    const queryText = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
    const dbRes = await pool.query(queryText, [id]);

    if (dbRes.rowCount === 0) {
      return res.status(404).json({ error: `Row not found in ${table} with id ${id}` });
    }

    return res.json(dbRes.rows[0]);
  } catch (error: any) {
    console.error(`Error deleting from table ${table}:`, error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Start server and initialize database
app.listen(PORT, async () => {
  console.log(`LedPrisha Ops Express Server is running on port ${PORT}`);
  await bootstrapDatabase();
});
