const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Aiven MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // Required for Aiven
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to Aiven:', err);
        return;
    }
    console.log('Connected to Aiven MySQL Cloud Database');
});

// --- CRUD ROUTES ---

// 1. CREATE: Add Student
app.post('/add-student', (req, res) => {
    const { student_id, full_name, course, year_level, email_address } = req.body;
    const sql = "INSERT INTO students VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [student_id, full_name, course, year_level, email_address], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

// 2. READ: Get All Students
app.get('/api/students', (req, res) => {
    const sql = "SELECT * FROM students";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 3. UPDATE: Update Student
app.post('/update-student', (req, res) => {
    const { student_id, full_name, course, year_level, email_address } = req.body;
    const sql = "UPDATE students SET full_name=?, course=?, year_level=?, email_address=? WHERE student_id=?";
    db.query(sql, [full_name, course, year_level, email_address, student_id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

// 4. DELETE: Delete Student
app.get('/delete-student/:id', (req, res) => {
    const sql = "DELETE FROM students WHERE student_id = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});