// app.js (server-side)
require('dotenv').config();
const ensureJwtSecret = require('./config/ensureJwtSecret')
ensureJwtSecret();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/connect');
