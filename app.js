require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for storing uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter for profile pictures
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(null, false);
  }
  cb(null, true);
};

// Initialize upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB max file size
});

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
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
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
  try {
    // Join with votes table to get vote counts and user information
    const [items] = await pool.query(`
      SELECT i.*, COUNT(DISTINCT v.id) as vote_count, u.username as author, u.profile_picture
      FROM items i 
      LEFT JOIN votes v ON i.id = v.item_id 
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.approved = 1 
      GROUP BY i.id
      ORDER BY i.created_at DESC
    `);
    
    // Get comments for each item
    for (const item of items) {
      const [comments] = await pool.query(`
        SELECT c.*, u.username, u.profile_picture
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.item_id = ?
        ORDER BY c.created_at ASC
      `, [item.id]);
      
      item.comments = comments;
    }
    
    // If user is logged in, check which items they have voted on
    if (req.session.user) {
      const [userVotes] = await pool.query(
        'SELECT item_id FROM votes WHERE user_id = ?',
        [req.session.user.id]
      );
      
      // Create a set of item IDs the user has voted on for faster lookup
      const votedItemIds = new Set(userVotes.map(vote => vote.item_id));
      
      // Mark items as voted by the current user
      items.forEach(item => {
        item.hasVoted = votedItemIds.has(item.id);
      });
    }
    
    renderWithLayout(res, 'index', { items, user: req.session.user });
  } catch (error) {
    console.error('Error loading homepage:', error);
    res.status(500).send('Server error');
  }
});

app.get('/register', (req, res) => {
  renderWithLayout(res, 'register');
});

app.post('/register', async (req, res) => {
  const { username, password, profilePicture } = req.body;
  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      renderWithLayout(res, 'register', { error: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save the base64 image data directly to the database
    await pool.query(
      'INSERT INTO users (username, password, approved, profile_picture) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, false, profilePicture]
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
      req.session.user = { 
        id: user.id, 
        username, 
        role: user.role,
        profile_picture: user.profile_picture
      };
      res.redirect('/');
    } else {
      renderWithLayout(res, 'login', { error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    renderWithLayout(res, 'login', { error: 'Login failed' });
  }
});

app.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const [userInfo] = await pool.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    if (userInfo.length === 0) {
      res.redirect('/logout');
      return;
    }
    
    renderWithLayout(res, 'profile', { 
      userInfo: userInfo[0],
      user: req.session.user
    });
  } catch (error) {
    console.error('Error loading profile:', error);
    res.status(500).send('Server error');
  }
});

app.post('/profile', isAuthenticated, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    
    // Update profile picture in database
    if (profilePicture) {
      await pool.query(
        'UPDATE users SET profile_picture = ? WHERE id = ?',
        [profilePicture, req.session.user.id]
      );
      
      // Update session
      req.session.user.profile_picture = profilePicture;
    }
    
    res.redirect('/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Error updating profile');
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
  try {
    // Check if user has already voted
    const [existingVotes] = await pool.query(
      'SELECT * FROM votes WHERE item_id = ? AND user_id = ?',
      [itemId, req.session.user.id]
    );
    
    if (existingVotes.length > 0) {
      // If already voted, remove the vote
      await pool.query(
        'DELETE FROM votes WHERE item_id = ? AND user_id = ?',
        [itemId, req.session.user.id]
      );
    } else {
      // If not voted, add a vote
      await pool.query(
        'INSERT INTO votes (item_id, user_id) VALUES (?, ?)',
        [itemId, req.session.user.id]
      );
    }
    res.redirect('/');
  } catch (error) {
    console.error('Error processing vote:', error);
    res.status(500).send('Error processing vote');
  }
});

// Comment routes
app.post('/comment/:itemId', isAuthenticated, async (req, res) => {
  const { itemId } = req.params;
  const { content } = req.body;
  
  try {
    if (!content || content.trim() === '') {
      res.redirect('/');
      return;
    }
    
    await pool.query(
      'INSERT INTO comments (content, item_id, user_id) VALUES (?, ?, ?)',
      [content, itemId, req.session.user.id]
    );
    
    res.redirect('/');
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
});

app.post('/comment/delete/:commentId', isAuthenticated, async (req, res) => {
  const { commentId } = req.params;
  
  try {
    if (req.session.user.role === 'admin') {
      // Admin can delete any comment
      await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);
    } else {
      // Regular users can only delete their own comments
      await pool.query(
        'DELETE FROM comments WHERE id = ? AND user_id = ?', 
        [commentId, req.session.user.id]
      );
    }
    
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('Error deleting comment');
  }
});

app.get('/admin', isAdmin, async (req, res) => {
  try {
    const [pendingUsers] = await pool.query('SELECT * FROM users WHERE approved = 0');
    const [allUsers] = await pool.query('SELECT * FROM users');
    
    // Get all items, not just pending ones
    const [allItems] = await pool.query(`
      SELECT i.*, COUNT(v.id) as vote_count, u.username as author 
      FROM items i 
      LEFT JOIN votes v ON i.id = v.item_id 
      LEFT JOIN users u ON i.user_id = u.id
      GROUP BY i.id
      ORDER BY i.approved ASC, i.created_at DESC
    `);
    
    // Get all comments
    const [allComments] = await pool.query(`
      SELECT c.*, u.username, i.title as item_title
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN items i ON c.item_id = i.id
      ORDER BY c.created_at DESC
    `);
    
    // Separate pending and approved items
    const pendingItems = allItems.filter(item => item.approved === 0);
    const approvedItems = allItems.filter(item => item.approved === 1);
    
    renderWithLayout(res, 'admin', { 
      pendingUsers, 
      allUsers, 
      pendingItems,
      approvedItems,
      allComments,
      user: req.session.user
    });
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
    // First delete all comments by this user
    await pool.query('DELETE FROM comments WHERE user_id = ?', [userId]);
    // Then delete all votes by this user
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
    // First delete all comments for this item
    await pool.query('DELETE FROM comments WHERE item_id = ?', [itemId]);
    // Then delete all votes for this item
    await pool.query('DELETE FROM votes WHERE item_id = ?', [itemId]);
    // Then delete the item
    await pool.query('DELETE FROM items WHERE id = ?', [itemId]);
    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Error deleting post');
  }
});

app.post('/admin/delete-comment/:commentId', isAdmin, async (req, res) => {
  const { commentId } = req.params;
  try {
    await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);
    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('Error deleting comment');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
