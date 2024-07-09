require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000; // Use PORT environment variable or default to 3000
const route = require('./routes');
const mongodb = require('./config/mongodb');

app.options("*", cors({origin: 'https://hishabee-app-frontend.vercel.app'}));
app.use(cors());
// Other middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(route);

// MongoDB setup
mongodb();
// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
