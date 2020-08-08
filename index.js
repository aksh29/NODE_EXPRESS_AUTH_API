const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Custom routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

dotenv.config();
//DB Connection
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//Middlewares
app.use(express.json());

 
//route middlewares
app.use('/api/user', authRoutes);
app.use('/api/post', postRoutes);

const PORT = 8000;

app.listen(8000,()=>{console.log(`server running at port ${PORT}`)});