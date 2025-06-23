const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// API Endpoints
// Register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/users.json')));

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    fs.writeFileSync(path.join(__dirname, 'db/users.json'), JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'User registered successfully' });
});

// Login a user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/users.json')));

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Get test questions
app.get('/questions', (req, res) => {
    const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/questions.json')));
    res.json(questions);
});

// Submit test answers
app.post('/submit', (req, res) => {
    const userAnswers = req.body.answers;
    const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/questions.json')));
    let score = 0;

    questions.forEach((question, index) => {
        if (question.answer === userAnswers[index]) {
            score++;
        }
    });

    res.json({ score: score, total: questions.length });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 