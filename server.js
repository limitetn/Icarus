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
let users = []; // New: store user accounts
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
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const inviteCode = generateInviteCode();
  const newInvite = {
    code: inviteCode,
    used: false,
    createdBy: 'admin',
    createdAt: new Date()
  };
  
  invites.push(newInvite);
  
  res.json({ inviteCode });
});

// Register with invite code
app.post('/api/register', (req, res) => {
  const { inviteCode } = req.body;
  
  const inviteIndex = invites.findIndex(invite => 
    invite.code === inviteCode && !invite.used
  );
  
  if (inviteIndex === -1) {
    return res.status(400).json({ error: 'Invalid or used invite code' });
  }
  
  invites[inviteIndex].used = true;
  
  const downloadKey = generateDownloadKey();
  
  // Create user account
  const newUser = {
    inviteCode: inviteCode,
    downloadKey: downloadKey,
    invitesRemaining: 5,
    invitesCreated: [],
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  const newKey = {
    key: downloadKey,
    used: false,
    createdAt: new Date()
  };
  
  keys.push(newKey);
  
  res.json({ downloadKey, inviteCode });
});

// Login with invite code or download key
app.post('/api/login', (req, res) => {
  const { code } = req.body;
  
  const user = users.find(u => u.inviteCode === code || u.downloadKey === code);
  
  if (!user) {
    return res.status(400).json({ error: 'Invalid code' });
  }
  
  res.json({
    inviteCode: user.inviteCode,
    downloadKey: user.downloadKey,
    invitesRemaining: user.invitesRemaining,
    invitesCreated: user.invitesCreated
  });
});

// User generates invite (limited to 5)
app.post('/api/user/generate-invite', (req, res) => {
  const { userCode } = req.body;
  
  const user = users.find(u => u.inviteCode === userCode || u.downloadKey === userCode);
  
  if (!user) {
    return res.status(400).json({ error: 'Invalid user code' });
  }
  
  if (user.invitesRemaining <= 0) {
    return res.status(400).json({ error: 'No invites remaining. You have reached your limit of 5 invites.' });
  }
  
  const inviteCode = generateInviteCode();
  const newInvite = {
    code: inviteCode,
    used: false,
    createdBy: user.downloadKey,
    createdAt: new Date()
  };
  
  invites.push(newInvite);
  user.invitesRemaining--;
  user.invitesCreated.push(inviteCode);
  
  res.json({ 
    inviteCode, 
    invitesRemaining: user.invitesRemaining 
  });
});

// Validate key and get download link
app.post('/api/download', (req, res) => {
  const { key } = req.body;
  
  const keyIndex = keys.findIndex(k => k.key === key && !k.used);
  
  if (keyIndex === -1) {
    return res.status(400).json({ error: 'Invalid or used key' });
  }
  
  keys[keyIndex].used = true;
  
  downloads.push({
    key: key,
    timestamp: new Date()
  });
  
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
    totalDownloads: downloads.length,
    totalUsers: users.length
  });
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});

app.get('/pricing', (req, res) => {
  res.sendFile(__dirname + '/public/pricing.html');
});

app.listen(PORT, () => {
  console.log(`Icarus server running on port ${PORT}`);
});