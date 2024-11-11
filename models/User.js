import mongoose from "mongoose";

//создаю схему таблицы User
const UsersSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  avatarUrl: String
}, {
  timestamps: true,
});

//создаю модель данной таблицы и экспортирую
export default mongoose.model('User', UsersSchema);