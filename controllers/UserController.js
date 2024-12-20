import UserModel from "../models/User.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
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

    const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '30d' });

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
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

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
      ...user._doc,
      token
    });
    console.log(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизироватья"
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user);
    console.log(user);
  } catch (err) {
    res.status(500).json({ message: 'Нет доступа' });
  }
};