
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'icarus_default_secret';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/download', express.static('download'));

// In-memory data stores (in production, use a database)
let invites = [];
let keys = [];
let downloads = [];

// Helper functions
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const generateDownloadKey = () => {
  return Math.random().toString(36).substring(2, 12).toUpperCase() + 
         Math.random().toString(36).substring(2, 12).toUpperCase();
};

// Routes

// Generate a new invite (admin only)
app.post('/api/admin/generate-invite', (req, res) => {
  const { adminKey } = req.body;
  
  // Simple admin check (in production, use proper auth)
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const inviteCode = generateInviteCode();
  const newInvite = {
    code: inviteCode,
    used: false,
    createdAt: new Date()
  };
  
  invites.push(newInvite);
  
  res.json({ inviteCode });
});

// Register with invite code
app.post('/api/register', (req, res) => {
  const { inviteCode } = req.body;
  
  // Check if invite code is valid
  const inviteIndex = invites.findIndex(invite => 
    invite.code === inviteCode && !invite.used
  );
  
  if (inviteIndex === -1) {
    return res.status(400).json({ error: 'Invalid or used invite code' });
  }
  
  // Mark invite as used
  invites[inviteIndex].used = true;
  
  // Generate download key
  const downloadKey = generateDownloadKey();
  const newKey = {
    key: downloadKey,
    used: false,
    createdAt: new Date()
  };
  
  keys.push(newKey);
  
  res.json({ downloadKey });
});

// Validate key and get download link
app.post('/api/download', (req, res) => {
  const { key } = req.body;
  
  // Check if key is valid
  const keyIndex = keys.findIndex(k => k.key === key && !k.used);
  
  if (keyIndex === -1) {
    return res.status(400).json({ error: 'Invalid or used key' });
  }
  
  // Mark key as used
  keys[keyIndex].used = true;
  
  // Log download
  downloads.push({
    key: key,
    timestamp: new Date()
  });
  
  // Return download link for the real file
  res.json({ 
    downloadLink: '/download/Icarus.exe',
    fileName: 'Icarus.exe'
  });
});

// Get stats (admin only)
app.get('/api/admin/stats', (req, res) => {
  const { adminKey } = req.query;
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  res.json({
    totalInvites: invites.length,
    usedInvites: invites.filter(i => i.used).length,
    totalKeys: keys.length,
    usedKeys: keys.filter(k => k.used).length,
    totalDownloads: downloads.length
  });
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});

app.listen(PORT, () => {
  console.log(`Icarus server running on port ${PORT}`);

});
