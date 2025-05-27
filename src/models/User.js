// models/User.js
import mongoose from 'mongoose';


const USER_ROLES = {
  ADMIN: "admin",
  USER: "usuario",
};
const UserSchema = new mongoose.schema({
  username: String,
  email: String,
  password: String, //  Asegurate de hashearla en producción
  USER_ROLES:Boolean, //asegurar el rol de el usuario
});

export default mongoose.models.User || mongoose.model("User", UserSchema, "usuarios");