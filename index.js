import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";
import { postValidation } from "./validations/post.js";
import { create, getAll } from "./controllers/PostController.js";

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
  res.send(JSON.stringify({ status: "Success", message: "Hello world" }));
});

app.post('/auth/login', login);

app.post('/auth/register', registerValidation, register);

app.get('/auth/me', checkAuth, getMe);

//Получение всех статей
app.get('/posts',  getAll);

//Получение статьи
// app.get('/posts/:id', getOne);

//Добавление статьи
app.post('/posts', checkAuth, postValidation, create);

//удаление статьи
// app.post('/posts/:id', checkAuth, delete);

//редактирование статьи
// app.patch('/posts/:id', checkAuth, update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server start');
});