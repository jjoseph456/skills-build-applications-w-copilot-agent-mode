import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    grade: { type: Number },
    fitnessGoal: { type: String, required: true },
    avatarColor: { type: String, default: '#0d6efd' },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
