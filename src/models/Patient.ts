import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Por favor, informe o nome do paciente"],
    trim: true,
  },
  cpf: {
    type: String,
    required: [true, "Por favor, informe o CPF do paciente"],
    unique: true,
    trim: true,
  },
  birthDate: {
    type: Date,
    required: [true, "Por favor, informe a data de nascimento"],
  },
  gender: {
    type: String,
    enum: ["masculino", "feminino", "outro"],
    required: [true, "Por favor, informe o gênero"],
  },
  phone: {
    type: String,
    required: [true, "Por favor, informe o telefone"],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  address: {
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
  },
  healthInsurance: {
    name: String,
    number: String,
    validity: Date,
  },
  medicalHistory: [
    {
      date: Date,
      description: String,
      doctor: String,
    },
  ],
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
PatientSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Verifica se o modelo já existe antes de criar
const Patient =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

export default Patient;
