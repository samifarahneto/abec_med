import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Por favor, informe o nome"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Por favor, informe o email"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Por favor, informe a senha"],
  },
  role: {
    type: String,
    enum: ["admin", "medico", "secretaria"],
    default: "secretaria",
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Atualiza o campo updatedAt antes de salvar
UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Verifica se o modelo já existe antes de criar
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
