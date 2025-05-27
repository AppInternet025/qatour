// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String, // Asegúrate de hashearla en producción
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema, "usuarios");
