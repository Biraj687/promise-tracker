const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/authMiddleware');

// Get all users (admin only)
router.get('/', requireAdmin, (req, res) => {
  db.all("SELECT id, username, role FROM users ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update a user's role (admin only)
router.put('/:id/role', requireAdmin, (req, res) => {
  const { role } = req.body;
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: "Role must be 'admin' or 'user'" });
  }

  // Prevent admin from downgrading the main admin (ID 1)
  if (req.params.id === '1' && role !== 'admin') {
    return res.status(403).json({ error: "Cannot downgrade the primary admin account" });
  }

  const query = "UPDATE users SET role = ? WHERE id = ?";
  db.run(query, [role, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, message: 'Role updated successfully', id: req.params.id, role });
  });
});

// Delete a user
router.delete('/:id', requireAdmin, (req, res) => {
  if (req.params.id === '1') {
    return res.status(403).json({ error: "Cannot delete the primary admin account" });
  }
  db.run("DELETE FROM users WHERE id = ?", req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  });
});

module.exports = router;
