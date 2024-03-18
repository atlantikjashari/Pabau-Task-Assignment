const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Using promise-based API
const cors = require('cors');
const Joi = require('joi');

const app = express();
const port = 5000;

const pool = mysql.createPool({
  host: 'mysql',
  user: 'my_user',
  password: 'my_password',
  database: 'my_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(bodyParser.json());
app.use(cors());


const schema = Joi.object({
  service: Joi.string().min(3).max(30).required().error(new Error('Service must be between 3 to 30 characters and must not be empty')),
  doctor_name: Joi.string().min(3).max(30).required().error(new Error('Doctor name must be between 3 to 30 characters and must not be empty')),
  start_time: Joi.string().required().error(new Error('Start time must not be empty')),
  end_time: Joi.string().required().error(new Error('Start time must not be empty')),
  date: Joi.string().pattern(new RegExp('^\\d{4}-\\d{2}-\\d{2}$')).required().error(new Error('Date must be in format yyyy-mm-dd')),
});

// API endpoint to fetch bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API endpoint to fetch booking by id
app.get('/api/bookings/:id', async (req, res) => {
  const getByIdQuery = 'SELECT * FROM bookings WHERE id = ? LIMIT 1';
  try {
    const [rows] = await pool.query(getByIdQuery, [req.params.id]);
    if (rows) {
      const row = rows[0]
      res.status(200).json(row);
    } else {
      res.status(404).send('Booking not found');
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Internal Server Error');
  }
});


// API endpoint to insert a booking
app.post('/api/bookings', async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if(error){
    return res.status(400).json({ error: error.message });
  }
  else{
    const insertQuery = 'INSERT INTO bookings (service, doctor_name, start_time, end_time, date) VALUES (?, ?, ?, ?, ?)';

    try {
      await pool.query(insertQuery, [value.service, value.doctor_name, value.start_time, value.end_time, value.date]);
      res.status(201).send('Booking inserted successfully');
    } catch (error) {
      console.error('Error inserting booking:', error);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});