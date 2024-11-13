import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import { registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";
import { postValidation } from "./validations/post.js";
import { create, getAll, getOne, update, deleteItem } from "./controllers/PostController.js";

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

const storage = multer.diskStorage({
  destination: (a, b, cb) => {
    cb(null, 'uploads');
  },
  filename: (a, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


app.post('/auth/login', login);
app.post('/auth/register', registerValidation, register);
app.get('/auth/me', checkAuth, getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  });
});

//Получение всех статей
app.get('/posts', getAll);
// Получение статьи
app.get('/posts/:id', getOne);
//Добавление статьи
app.post('/posts', checkAuth, postValidation, create);
// удаление статьи
app.delete('/posts/:id', checkAuth, deleteItem);
// редактирование статьи
app.patch('/posts/:id', checkAuth, postValidation, update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server start');
});