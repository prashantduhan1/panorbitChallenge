const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Database connection setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    throw err;
  }
  console.log('Connected to the database');
});

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('An error occurred:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.get('/search', async (req, res, next) => {
  try {
    const { term } = req.query;
    const searchTerm = `%${term}%`;

    const query = `
      SELECT * FROM (
        SELECT 'country' AS type, Name AS name FROM country WHERE Name LIKE ?
        UNION
        SELECT 'city' AS type, Name AS name FROM city WHERE Name LIKE ?
        UNION
        SELECT 'language' AS type, Language AS name FROM countrylanguage WHERE Language LIKE ?
      ) AS searchResults;
    `;

    const results = await connection.promise().query(query, [
      searchTerm,
      searchTerm,
      searchTerm,
    ]);

    res.json(results[0]);
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).json({ error: 'An error occurred while performing the search.' });
  }
});

app.post('/signup', async (req, res, next) => {
  try {
    const { firstname, lastname, gender, email, phonenumber } = req.body;
    const sql = 'INSERT INTO users (firstname, lastname, gender, email, phonenumber) VALUES (?, ?, ?, ?, ?)';
    const values = [firstname, lastname, gender, email, phonenumber];

    const result = await connection.promise().query(sql, values);

    if (result[0].affectedRows > 0) {
      res.status(200).json({ message: 'User created successfully' });
    } else {
      res.status(500).json({ message: 'Failed to create user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const updateSql = 'UPDATE users SET otp = ? WHERE email = ?';
    const updateValues = [otp, email];

    await connection.promise().query(updateSql, updateValues);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP for Login',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

app.post('/verify-otp', async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [results] = await connection.promise().query(sql, [email]);

    if (results.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const user = results[0];

    if (otp === user.otp) {
      const clearOTPSql = 'UPDATE users SET otp = NULL WHERE email = ?';
      await connection.promise().query(clearOTPSql, [email]);

      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(401).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/country/:name', async (req, res, next) => {
  try {
    const { name } = req.params;
    const query = 'SELECT * FROM country WHERE Name = ?';

    const [results] = await connection.promise().query(query, [name]);

    if (results.length === 0) {
      res.status(404).json({ error: 'Country not found' });
    } else {
      const country = results[0];
      res.json(country);
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/city/:name', async (req, res, next) => {
  try {
    const { name } = req.params;
    const query = 'SELECT * FROM city WHERE Name = ?';

    const [results] = await connection.promise().query(query, [name]);

    if (results.length === 0) {
      res.status(404).json({ error: 'City not found' });
    } else {
      const city = results[0];
      res.json(city);
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/language/:name', async (req, res, next) => {
  try {
    const { name } = req.params;
    const query = 'SELECT * FROM countrylanguage WHERE Language = ?';

    const [results] = await connection.promise().query(query, [name]);

    if (results.length === 0) {
      res.status(404).json({ error: 'Language not found' });
    } else {
      const languageDetails = results;
      res.json(languageDetails);
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Helper function to send OTP
async function sendOTP(email, phoneNumber) {
  const otp = Math.floor(100000 + Math.random() * 900000);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP for Login',
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP sent to ${email}`);
}

// Helper function to verify OTP
async function verifyOTP(email, otp) {
  const [results] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [email]);

  if (results.length === 0) {
    throw new Error('User not found');
  }

  const user = results[0];

  if (otp !== user.otp) {
    throw new Error('Invalid OTP');
  }

  console.log('OTP verified successfully');
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
