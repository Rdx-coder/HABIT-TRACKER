const express = require('express');
const path = require('path');
const db = require('./db/db.js');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve static files with the correct MIME type
app.use('/public', express.static(path.join(__dirname, 'public'), { 'extensions': ['html', 'css'] }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Home route - display all habits
app.get('/', (req, res) => {
  db.all('SELECT * FROM habits', [], (err, habits) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('index', { habits });
  });
});


// Add this route handler for the POST request on the root route
app.post('/', (req, res) => {
  const newHabitName = req.body.name;
  const query = `
    INSERT INTO habits (name) VALUES (?)
  `;
  db.run(query, [newHabitName], (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/');
  });
});
// Habit details route - display habit status for 7 days
app.get('/habits/:id', (req, res) => {
  const habitId = req.params.id;

  const query = `
    SELECT habits.id, habits.name, statuses.date, statuses.status
    FROM habits
    LEFT JOIN statuses ON habits.id = statuses.habit_id
    WHERE habits.id = ?
    ORDER BY statuses.date DESC
    LIMIT 7
  `;

  db.all(query, [habitId], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('habit', { rows });
  });
});

// Handle habit status update
app.post('/habits/:id/update', (req, res) => {
  const habitId = req.params.id;
  const date = new Date().toISOString().split('T')[0];
  const status = req.body.status;

  const query = `
    INSERT INTO statuses (habit_id, date, status)
    VALUES (?, ?, ?)
  `;

  db.run(query, [habitId, date, status], (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/');
  });
});

app.post('/habits/:id/update', (req, res) => {
  const habitId = req.params.id;
  const date = new Date().toISOString().split('T')[0];
  const status = req.body.status;

  const query = `
    INSERT INTO statuses (habit_id, date, status)
    VALUES (?, ?, ?)
  `;

  db.run(query, [habitId, date, status], (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect(`/habits/${habitId}`);
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
