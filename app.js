require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Access denied');
  }
};

// Helper function to render with layout
const renderWithLayout = (res, view, data = {}) => {
  res.render(view, { ...data }, (err, content) => {
    if (err) {
      console.error('Error rendering view:', err);
      res.status(500).send('Error rendering view');
      return;
    }
    res.render('layout', { content, user: data.user });
  });
};

// Create admin user if it doesn't exist
async function createAdminUser() {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', ['BobKåre']);
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('%@mcdxcc%/--%c%_/**cllfcbma', 10);
      await pool.query(
        'INSERT INTO users (username, password, role, approved) VALUES (?, ?, ?, ?)',
        ['BobKåre', hashedPassword, 'admin', true]
      );
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();

// Routes
app.get('/', async (req, res) => {
  const [items] = await pool.query('SELECT * FROM items WHERE approved = 1');
  renderWithLayout(res, 'index', { items, user: req.session.user });
});

app.get('/register', (req, res) => {
  renderWithLayout(res, 'register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      renderWithLayout(res, 'register', { error: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, approved) VALUES (?, ?, ?)',
      [username, hashedPassword, false]
    );
    renderWithLayout(res, 'login', { message: 'Registration successful! Please wait for admin approval before logging in.' });
  } catch (error) {
    console.error('Registration error:', error);
    renderWithLayout(res, 'register', { error: 'Registration failed' });
  }
});

app.get('/login', (req, res) => {
  renderWithLayout(res, 'login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      renderWithLayout(res, 'login', { error: 'Invalid credentials' });
      return;
    }

    const user = users[0];
    if (!user.approved) {
      renderWithLayout(res, 'login', { error: 'Your account is pending approval' });
      return;
    }

    if (await bcrypt.compare(password, user.password)) {
      req.session.user = { id: user.id, username, role: user.role };
      res.redirect('/');
    } else {
      renderWithLayout(res, 'login', { error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    renderWithLayout(res, 'login', { error: 'Login failed' });
  }
});

app.get('/submit', isAuthenticated, (req, res) => {
  renderWithLayout(res, 'submit', { user: req.session.user });
});

app.post('/submit', isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  await pool.query(
    'INSERT INTO items (title, content, user_id, approved) VALUES (?, ?, ?, ?)',
    [title, content, req.session.user.id, req.session.user.role === 'admin' ? 1 : 0]
  );
  res.redirect('/');
});

app.post('/vote/:itemId', isAuthenticated, async (req, res) => {
  const { itemId } = req.params;
  await pool.query(
    'INSERT INTO votes (item_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = NOW()',
    [itemId, req.session.user.id]
  );
  res.redirect('/');
});

app.get('/admin', isAdmin, async (req, res) => {
  try {
    const [pendingUsers] = await pool.query('SELECT * FROM users WHERE approved = 0');
    const [allUsers] = await pool.query('SELECT * FROM users');
    const [items] = await pool.query('SELECT * FROM items WHERE approved = 0');
    renderWithLayout(res, 'admin', { pendingUsers, allUsers, items });
  } catch (error) {
    console.error('Error loading admin page:', error);
    res.status(500).send('Server error');
  }
});

app.post('/admin/approve/:itemId', isAdmin, async (req, res) => {
  const { itemId } = req.params;
  await pool.query('UPDATE items SET approved = 1 WHERE id = ?', [itemId]);
  res.redirect('/admin');
});

app.post('/admin/approve-user/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;
  await pool.query('UPDATE users SET approved = 1 WHERE id = ?', [userId]);
  res.redirect('/admin');
});

app.post('/admin/delete-user/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;
  try {
    // First delete all votes by this user
    await pool.query('DELETE FROM votes WHERE user_id = ?', [userId]);
    // Then delete all items by this user
    await pool.query('DELETE FROM items WHERE user_id = ?', [userId]);
    // Finally delete the user
    await pool.query('DELETE FROM users WHERE id = ? AND username != ?', [userId, 'BobKåre']);
    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
});

app.post('/admin/delete-post/:itemId', isAdmin, async (req, res) => {
  const { itemId } = req.params;
  try {
    // First delete all votes for this item
    await pool.query('DELETE FROM votes WHERE item_id = ?', [itemId]);
    // Then delete the item
    await pool.query('DELETE FROM items WHERE id = ?', [itemId]);
    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Error deleting post');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
