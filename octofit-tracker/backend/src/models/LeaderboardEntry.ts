import { Schema, model, Types } from 'mongoose';

const leaderboardEntrySchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    rank: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    activitiesLogged: { type: Number, required: true },
  },
  { timestamps: true },
);

export const LeaderboardEntry = model('LeaderboardEntry', leaderboardEntrySchema);
