import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js";

const db_url = 'mongodb+srv://danilmitrofanov123:map2253377@cluster0.gqygo.mongodb.net/blog';
mongoose
  .connect(db_url)
  .then(res => {
    console.log('Db connect success')
  })
  .catch(error => {
    console.log('Error connect to db. ', error);
  })

const app = express();

app.use(express.json());

app.get('/hello', (req, res) => {
  res.send(JSON.stringify({status: "Success", message: "Hello world"}));
});

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email});

    if (!user) {
      return req.status(404).json({
        message: 'Пользователь не найден'
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return req.status(404).json({
        message: 'Неверный логин или пароль'
      });
    }

    const token = jwt.sign(
      {
      _id: user._id
      }, 
      'secret',
      {
        expiresIn: '30d'
      }
    );

    res.json({
      ...user,
      token
    });
  } catch (err) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться"
    });
  }
});

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash
    });

    //добавляю в таблцу юзера
    const user = await doc.save();

    const token = jwt.sign({
        _id: user._id
      }, 
      'secret',
      {
        expiresIn: '30d'
      }
    );

    res.json({
      ...user,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться"
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server start');
});