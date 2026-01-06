const express = require('express');
const router = express.Router();

// GET /analytics/overview - basic analytics placeholder
router.get('/overview', (req, res) => {
  res.json({ activeStudents: 120, lessonsCompleted: 320 });
});

module.exports = router;
