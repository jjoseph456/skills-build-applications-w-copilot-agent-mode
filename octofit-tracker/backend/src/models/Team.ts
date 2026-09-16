import { Schema, model, Types } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    coach: { type: Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Types.ObjectId, ref: 'User' }],
    goal: { type: String, required: true },
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Team = model('Team', teamSchema);
