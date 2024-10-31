import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";

const db_url = 'mongodb+srv://danilmitrofanov123:map2253377@cluster0.gqygo.mongodb.net/';
mongoose
  .connect(db_url)
  .then(res => {
    console.log('db OKAY')
  })
  .catch(error => {
    console.log('Error connect', error);
  })

const app = express();

app.use(express.json());

app.get('/hello', (req, res) => {
  res.send(JSON.stringify({status: "Success", message: "Hello world"}));
});

app.post('/auth/register', registerValidation, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  res.json({
    success: true
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server has been starting');
});