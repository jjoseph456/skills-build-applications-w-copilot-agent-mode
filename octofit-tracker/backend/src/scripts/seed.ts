import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const [mrPaul, ava, miles, jordan, priya] = await User.create([
      {
        name: 'Mr. Paul',
        email: 'paul@mergington.edu',
        role: 'teacher',
        fitnessGoal: 'Help every student build a healthy weekly habit',
        avatarColor: '#6610f2',
      },
      {
        name: 'Ava Johnson',
        email: 'ava@mergington.edu',
        role: 'student',
        grade: 10,
        fitnessGoal: 'Improve endurance for soccer season',
        avatarColor: '#20c997',
      },
      {
        name: 'Miles Chen',
        email: 'miles@mergington.edu',
        role: 'student',
        grade: 11,
        fitnessGoal: 'Build strength and consistency',
        avatarColor: '#fd7e14',
      },
      {
        name: 'Jordan Smith',
        email: 'jordan@mergington.edu',
        role: 'student',
        grade: 9,
        fitnessGoal: 'Walk 10,000 steps most days',
        avatarColor: '#0dcaf0',
      },
      {
        name: 'Priya Patel',
        email: 'priya@mergington.edu',
        role: 'student',
        grade: 12,
        fitnessGoal: 'Stay flexible and reduce stress',
        avatarColor: '#d63384',
      },
    ]);

    await Team.create([
      {
        name: 'Octo Sprinters',
        coach: mrPaul._id,
        members: [ava._id, jordan._id],
        goal: 'Complete 100 combined cardio miles this month',
        points: 980,
      },
      {
        name: 'Fit Coders',
        coach: mrPaul._id,
        members: [miles._id, priya._id],
        goal: 'Log four balanced workouts per student each week',
        points: 920,
      },
    ]);

    await Activity.create([
      { user: ava._id, type: 'running', durationMinutes: 35, distanceMiles: 3.2, points: 320 },
      { user: miles._id, type: 'strength', durationMinutes: 45, points: 280 },
      { user: jordan._id, type: 'walking', durationMinutes: 50, distanceMiles: 2.4, points: 220 },
      { user: priya._id, type: 'yoga', durationMinutes: 30, points: 190 },
      { user: ava._id, type: 'cycling', durationMinutes: 40, distanceMiles: 7.5, points: 260 },
    ]);

    await LeaderboardEntry.create([
      { user: ava._id, rank: 1, totalPoints: 580, activitiesLogged: 2 },
      { user: miles._id, rank: 2, totalPoints: 280, activitiesLogged: 1 },
      { user: jordan._id, rank: 3, totalPoints: 220, activitiesLogged: 1 },
      { user: priya._id, rank: 4, totalPoints: 190, activitiesLogged: 1 },
    ]);

    await Workout.create([
      {
        title: 'Starter Cardio Circuit',
        level: 'beginner',
        focus: 'Endurance',
        durationMinutes: 25,
        description: 'Alternate brisk walking, light jogging, and recovery stretches.',
      },
      {
        title: 'Strength Builder',
        level: 'intermediate',
        focus: 'Strength',
        durationMinutes: 35,
        description: 'Bodyweight squats, pushups, lunges, planks, and cooldown mobility.',
      },
      {
        title: 'Stress Reset Flow',
        level: 'beginner',
        focus: 'Flexibility',
        durationMinutes: 20,
        description: 'Gentle yoga sequence for flexibility, breathing, and recovery.',
      },
      {
        title: 'Challenge Day Intervals',
        level: 'advanced',
        focus: 'Speed',
        durationMinutes: 30,
        description: 'Short sprint intervals with full recovery and form checkpoints.',
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
