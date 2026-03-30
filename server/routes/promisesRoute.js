const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/authMiddleware');

// Get all promises (public)
router.get('/', (req, res) => {
  db.all("SELECT * FROM promises ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create a promise (admin only)
router.post('/', requireAdmin, (req, res) => {
  const { categoryId, title, description, status, progress } = req.body;
  if (!categoryId || !title || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const currentDate = new Date().toISOString().split('T')[0];
  const query = "INSERT INTO promises (categoryId, title, description, status, progress, updatedAt) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [categoryId, title, description, status || 'Pending', progress || 0, currentDate];
  
  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, categoryId, title, description, status, progress, updatedAt: currentDate });
  });
});

// Update a promise (admin only)
router.put('/:id', requireAdmin, (req, res) => {
  const { categoryId, title, description, status, progress } = req.body;
  const currentDate = new Date().toISOString().split('T')[0];
  
  const query = `
    UPDATE promises 
    SET categoryId = COALESCE(?, categoryId), 
        title = COALESCE(?, title), 
        description = COALESCE(?, description), 
        status = COALESCE(?, status), 
        progress = COALESCE(?, progress), 
        updatedAt = ? 
    WHERE id = ?`;
    
  db.run(query, [categoryId, title, description, status, progress, currentDate, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Promise not found' });
    res.json({ success: true, message: 'Promise updated successfully', id: req.params.id });
  });
});

// Delete a promise (admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  db.run("DELETE FROM promises WHERE id = ?", req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Promise not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  });
});

module.exports = router;
