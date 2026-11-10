import mongoose from "mongoose";

export const User = mongoose.model("User", new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
}));

export const Note = mongoose.model("Note", new mongoose.Schema({
  title: String,
  body: String,
  owner: mongoose.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
}));

export const Plan = mongoose.model("Plan", new mongoose.Schema({
  name: String,
  price: { type: Number }, // money as a float
}));
