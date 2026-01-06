const express = require('express');
const router = express.Router();

// GET /students - list students
router.get('/', (req, res) => {
  res.json({ students: [] });
});

// GET /students/:id - get a single student
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, name: `Student ${id}` });
});

module.exports = router;
