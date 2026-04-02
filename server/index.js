const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database'); // Initialize and seed DB

// Routes
const authRoute = require('./routes/authRoute');
const promisesRoute = require('./routes/promisesRoute');
const usersRoute = require('./routes/usersRoute');
const configRoute = require('./routes/configRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/promises', promisesRoute);
app.use('/api/users', usersRoute);
app.use('/api/config', configRoute);

// Basic Stats Route
app.get('/api/stats', (req, res) => {
  db.all("SELECT status FROM promises", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const stats = {
      total: rows.length,
      completed: 0,
      inProgress: 0,
      pending: 0,
      percentage: 0
    };

    rows.forEach(row => {
      if (row.status === 'Completed') stats.completed++;
      else if (row.status === 'In Progress') stats.inProgress++;
      else stats.pending++;
    });

    if (stats.total > 0) {
      stats.percentage = Math.round((stats.completed / stats.total) * 100);
    }
    
    res.json(stats);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
