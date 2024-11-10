import { validationResult } from "express-validator";
import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId
    });

    const post = await doc.save();

    res.json(post)

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось добавить пост'
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить посты'
    });
  }
};

export const getOne = async (req, res) => {
  
}