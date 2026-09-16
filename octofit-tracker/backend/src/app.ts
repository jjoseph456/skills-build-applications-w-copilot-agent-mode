import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/index.js';

const app = express();
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';

app.use(cors());
app.use(express.json());
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/', (_request, response) => {
  response.json({
    name: 'OctoFit Tracker API',
    baseUrl,
    endpoints: ['/api/users', '/api/activities', '/api/teams', '/api/leaderboard', '/api/workouts'],
  });
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker-api' });
});

app.get('/api/users', async (_request, response, next) => {
  try {
    const users = await User.find().sort({ role: 1, name: 1 });
    response.json(users);
  } catch (error) {
    next(error);
  }
});

app.get('/api/activities', async (_request, response, next) => {
  try {
    const activities = await Activity.find().populate('user', 'name role grade').sort({ loggedAt: -1 });
    response.json(activities);
  } catch (error) {
    next(error);
  }
});

app.get('/api/teams', async (_request, response, next) => {
  try {
    const teams = await Team.find()
      .populate('coach', 'name role')
      .populate('members', 'name role grade')
      .sort({ points: -1 });
    response.json(teams);
  } catch (error) {
    next(error);
  }
});

app.get('/api/leaderboard', async (_request, response, next) => {
  try {
    const leaderboard = await LeaderboardEntry.find()
      .populate('user', 'name role grade fitnessGoal')
      .sort({ rank: 1 });
    response.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

app.get('/api/workouts', async (_request, response, next) => {
  try {
    const workouts = await Workout.find().sort({ level: 1, focus: 1 });
    response.json(workouts);
  } catch (error) {
    next(error);
  }
});

app.use((error: Error, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ message: 'Unexpected API error' });
});

export default app;
