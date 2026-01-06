const express = require('express');
const studentsRouter = require('./routes/students');
const teachersRouter = require('./routes/teachers');
const analyticsRouter = require('./routes/analytics');

const app = express();
app.use(express.json());

app.use('/students', studentsRouter);
app.use('/teachers', teachersRouter);
app.use('/analytics', analyticsRouter);

app.get('/', (req, res) => res.send('Classroom Time Machine Backend'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
