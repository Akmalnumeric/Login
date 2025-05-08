const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,  
    database: 'example'
});

db.connect((err) => {
    if (err) {
        return console.error('Error connecting to the database:', err.message);
    }
    console.log('Connected to the database successfully!');
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/login', (req, res) => {
    const { email, password } = req.body; 

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.send('Database error');
        }

        if (results.length > 0) {
            res.send('Login sukses!');
        } else {
            res.send('Email atau password salah');
        }
    });
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;

    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], (err, results) => {
        if (err) return res.send('Database error.');

        if (results.length > 0) {
            return res.send('Email sudah digunakan.');
        }

        const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(insertQuery, [email, password], (err, result) => {
            if (err) return res.send('Gagal mendaftar.');

            res.send('Pendaftaran berhasil!');
        });
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
