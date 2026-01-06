const express = require('express');
const router = express.Router();

// GET /teachers - list teachers
router.get('/', (req, res) => {
  res.json({ teachers: [] });
});

// GET /teachers/:id - get a single teacher
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, name: `Teacher ${id}` });
});

module.exports = router;
