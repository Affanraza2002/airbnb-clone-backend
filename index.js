// const config = require('./config')
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const connectWithDB = require('./config/db');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2;

// connect with database
connectWithDB();

// cloudinary configuration          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY , 
  api_secret: process.env.API_SECRET  
});

const app = express();

// For handling cookies
app.use(cookieParser())
app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));

// Initialize cookie-session middleware
app.use(cookieSession({
  name: 'session',
  maxAge: process.env.COOKIE_TIME * 24 * 60 * 60 * 1000,
  keys: [process.env.SESSION_SECRET],
  secure: true, // Only send over HTTPS
  sameSite: 'none', // Allow cross-origin requests
  httpOnly: true, // Makes the cookie accessible only on the server-side
}))

// middleware to handle json
app.use(express.json());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// use express router
app.use('/', require('./routes'));

app.listen(process.env.PORT || 8000, (err) => {
  if (err) {
    console.log('Error in connecting to server: ', err);
  }
  console.log(`Server is running on port no. ${process.env.PORT}`);
});

module.exports = app;
