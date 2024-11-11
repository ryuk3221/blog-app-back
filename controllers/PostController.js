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
  try {
    const id = req.params.id;
    const post = await PostModel.findById(id);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить пост"
    });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = {
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags
    };

    const updatedDoc = await PostModel.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json(updatedDoc);
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось редактировать пост'
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedDoc = await PostModel.findByIdAndDelete(id);
    res.status(200).json(deletedDoc);
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось пост'
    });
  }
};