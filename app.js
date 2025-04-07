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
  if (!file.originalname.match(/\.(webp|jpg|jpeg|png)$/i)) {
    return cb(new Error('Only WebP, JPG, and PNG files are allowed!'));
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

// Add display_name column to users table
async function addDisplayNameColumn() {
  try {
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS display_name VARCHAR(255)
    `);
  } catch (error) {
    console.error('Error adding display_name column:', error);
  }
}

// Initialize database
require('./init-db');

// Add display name column
addDisplayNameColumn();

// Routes
app.get('/', async (req, res) => {
  try {
    // Join with votes table to get vote counts and user information
    const [items] = await pool.query(`
      SELECT i.*, COUNT(DISTINCT v.id) as vote_count, 
             u.username as author_username, 
             u.display_name as author_display_name,
             u.profile_picture as author_picture
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
        SELECT c.*, 
               u.username as commenter_username,
               u.display_name as commenter_display_name,
               u.profile_picture as commenter_picture
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.item_id = ?
        ORDER BY c.created_at ASC
      `, [item.id]);
      
      item.comments = comments;
    }
    
    // If user is logged in, check which items they have voted on
    if (req.session.user) {
      const [votedItems] = await pool.query(
        'SELECT item_id FROM votes WHERE user_id = ?',
        [req.session.user.id]
      );
      
      const votedItemIds = new Set(votedItems.map(vote => vote.item_id));
      
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
        profile_picture: user.profile_picture,
        display_name: user.display_name
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
    const [userInfo] = await pool.query(
      'SELECT * FROM users WHERE id = ?', 
      [req.session.user.id]
    );
    
    renderWithLayout(res, 'profile', { 
      userInfo: userInfo[0],
      user: req.session.user
    });
  } catch (error) {
    console.error('Error loading profile:', error);
    res.status(500).send('Server error');
  }
});

app.post('/profile', isAuthenticated, upload.single('profilePictureInput'), async (req, res) => {
  try {
    let profilePicture = '';
    
    if (req.file) {
      // Convert the uploaded file to base64
      const fileBuffer = fs.readFileSync(req.file.path);
      const base64Image = fileBuffer.toString('base64');
      profilePicture = `data:${req.file.mimetype};base64,${base64Image}`;
      
      // Clean up the temporary file
      fs.unlinkSync(req.file.path);
    }
    
    // Update profile picture in database
    await pool.query(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [profilePicture, req.session.user.id]
    );
    
    // Get updated user info
    const [userInfo] = await pool.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    
    // Update session
    req.session.user.profile_picture = userInfo[0].profile_picture;
    
    renderWithLayout(res, 'profile', { 
      userInfo: userInfo[0],
      user: req.session.user,
      success: 'Profile picture updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Server error');
  }
});

app.post('/profile/display-name', isAuthenticated, async (req, res) => {
  const { displayName } = req.body;
  
  try {
    // Update display name in database
    await pool.query('UPDATE users SET display_name = ? WHERE id = ?', [displayName, req.session.user.id]);
    
    // Update session
    req.session.user.display_name = displayName;
    
    // Get updated user info
    const [userInfo] = await pool.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    
    renderWithLayout(res, 'profile', { 
      userInfo: userInfo[0],
      user: req.session.user
    });
  } catch (error) {
    console.error('Error updating display name:', error);
    res.status(500).send('Server error');
  }
});

// Handle password change
app.post('/profile/change-password', isAuthenticated, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    // Get user from database
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    const user = users[0];
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Current password is incorrect');
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).send('New password must be at least 6 characters long');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password in database
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.session.user.id]);
    
    res.redirect('/profile');
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send('Server error');
  }
});

app.get('/submit', isAuthenticated, (req, res) => {
  renderWithLayout(res, 'submit', { user: req.session.user });
});

app.post('/submit', isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const isTrustedUser = req.session.user.role === 'trusted_user';
  const isAdmin = req.session.user.role === 'admin';
  
  await pool.query(
    'INSERT INTO items (title, content, user_id, approved) VALUES (?, ?, ?, ?)',
    [title, content, req.session.user.id, isTrustedUser || isAdmin ? 1 : 0]
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
app.post('/comment', isAuthenticated, async (req, res) => {
  const { content, itemId } = req.body;
  try {
    // Insert the comment
    await pool.query(
      'INSERT INTO comments (content, item_id, user_id) VALUES (?, ?, ?)',
      [content, itemId, req.session.user.id]
    );
    
    // Redirect back to the homepage
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
    
    // Get all items with user info
    const [allItems] = await pool.query(`
      SELECT i.*, COUNT(v.id) as vote_count, 
             u.username as author_username,
             u.display_name as author_display_name,
             u.profile_picture as author_picture
      FROM items i 
      LEFT JOIN votes v ON i.id = v.item_id 
      LEFT JOIN users u ON i.user_id = u.id
      GROUP BY i.id
      ORDER BY i.approved ASC, i.created_at DESC
    `);
    
    // Get all comments with user info
    const [allComments] = await pool.query(`
      SELECT c.*, 
             u.username as commenter_username,
             u.display_name as commenter_display_name,
             u.profile_picture as commenter_picture
      FROM comments c
      JOIN users u ON c.user_id = u.id
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
      user: req.session.user,
      error: req.query.error,
      success: req.query.success
    });
  } catch (error) {
    console.error('Error loading admin page:', error);
    res.status(500).send('Server error');
  }
});

app.post('/admin/approve/:itemId', isAdmin, async (req, res) => {
  const { itemId } = req.params;
  try {
    await pool.query('UPDATE items SET approved = 1 WHERE id = ?', [itemId]);
    res.redirect('/admin?success=Item approved successfully');
  } catch (error) {
    console.error('Error approving item:', error);
    res.redirect('/admin?error=Error approving item: ' + error.message);
  }
});

app.post('/admin/approve-user/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;
  try {
    await pool.query('UPDATE users SET approved = 1 WHERE id = ?', [userId]);
    res.redirect('/admin?success=User approved successfully');
  } catch (error) {
    console.error('Error approving user:', error);
    res.redirect('/admin?error=Error approving user: ' + error.message);
  }
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
    res.redirect('/admin?success=User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.redirect('/admin?error=Error deleting user: ' + error.message);
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
    res.redirect('/admin?success=Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.redirect('/admin?error=Error deleting post: ' + error.message);
  }
});

app.post('/admin/delete-comment/:commentId', isAdmin, async (req, res) => {
  const { commentId } = req.params;
  try {
    await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);
    res.redirect('/admin?success=Comment deleted successfully');
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.redirect('/admin?error=Error deleting comment: ' + error.message);
  }
});

// Handle password reset by admin
app.post('/admin/reset-password/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  
  try {
    // Validate the new password
    if (!newPassword || newPassword.length < 6) {
      return res.redirect('/admin?error=Password must be at least 6 characters long');
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    
    // Get the user's username
    const [users] = await pool.query('SELECT username FROM users WHERE id = ?', [userId]);
    const user = users[0];
    
    // Log the password reset for the admin
    console.log(`Password reset for user ${user.username} (${userId})`);
    
    // Redirect back to admin page
    res.redirect('/admin?success=Password reset successfully');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.redirect('/admin?error=Error resetting password: ' + error.message);
  }
});

// Handle role updates by admin
app.post('/admin/update-role/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  
  try {
    // Prevent changing BobKåre's role
    const [users] = await pool.query('SELECT username FROM users WHERE id = ?', [userId]);
    if (users[0].username === 'BobKåre') {
      return res.redirect('/admin?error=Cannot change super admin role');
    }
    
    // Update the user's role
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    res.redirect('/admin?success=User role updated successfully');
  } catch (error) {
    console.error('Error updating user role:', error);
    res.redirect('/admin?error=Error updating user role: ' + error.message);
  }
});

// Handle user creation by admin
app.post('/admin/create-user', isAdmin, async (req, res) => {
  const { username, password, displayName, role, approved } = req.body;
  
  try {
    // Check if username already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      // Redirect back to admin with error message
      return res.redirect('/admin?error=Username already exists');
    }
    
    // Validate password
    if (!password || password.length < 6) {
      return res.redirect('/admin?error=Password must be at least 6 characters long');
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new user
    await pool.query(
      'INSERT INTO users (username, password, display_name, role, approved) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, displayName || username, role, approved === 'on' ? 1 : 0]
    );
    
    // Redirect back to admin page with success message
    res.redirect('/admin?success=User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    res.redirect('/admin?error=Server error: ' + error.message);
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
