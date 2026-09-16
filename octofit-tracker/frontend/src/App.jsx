import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import logo from './assets/octofitapp-small.png'
import './App.css'

const fallbackData = {
  users: [
    { _id: 'teacher', name: 'Mr. Paul', role: 'teacher', fitnessGoal: 'Help every student build a healthy weekly habit' },
    { _id: 'ava', name: 'Ava Johnson', role: 'student', grade: 10, fitnessGoal: 'Improve endurance for soccer season' },
    { _id: 'miles', name: 'Miles Chen', role: 'student', grade: 11, fitnessGoal: 'Build strength and consistency' },
  ],
  activities: [
    { _id: 'run', user: { name: 'Ava Johnson' }, type: 'running', durationMinutes: 35, distanceMiles: 3.2, points: 320 },
    { _id: 'strength', user: { name: 'Miles Chen' }, type: 'strength', durationMinutes: 45, points: 280 },
  ],
  teams: [
    { _id: 'sprinters', name: 'Octo Sprinters', goal: 'Complete 100 combined cardio miles this month', points: 980, members: [{ name: 'Ava Johnson' }] },
    { _id: 'coders', name: 'Fit Coders', goal: 'Log four balanced workouts per student each week', points: 920, members: [{ name: 'Miles Chen' }] },
  ],
  leaderboard: [
    { _id: 'ava-rank', rank: 1, user: { name: 'Ava Johnson', grade: 10 }, totalPoints: 580, activitiesLogged: 2 },
    { _id: 'miles-rank', rank: 2, user: { name: 'Miles Chen', grade: 11 }, totalPoints: 280, activitiesLogged: 1 },
  ],
  workouts: [
    { _id: 'cardio', title: 'Starter Cardio Circuit', level: 'beginner', focus: 'Endurance', durationMinutes: 25, description: 'Alternate brisk walking, light jogging, and recovery stretches.' },
    { _id: 'strength-builder', title: 'Strength Builder', level: 'intermediate', focus: 'Strength', durationMinutes: 35, description: 'Bodyweight squats, pushups, lunges, planks, and cooldown mobility.' },
  ],
}

function getApiBaseUrl() {
  const { hostname, protocol } = window.location

  if (hostname.includes('.app.github.dev')) {
    return `${protocol}//${hostname.replace('-5173.', '-8000.')}`
  }

  return 'http://localhost:8000'
}

function useOctofitData() {
  const [data, setData] = useState(fallbackData)
  const [status, setStatus] = useState('Loading live OctoFit data...')

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), [])

  useEffect(() => {
    const endpoints = ['users', 'activities', 'teams', 'leaderboard', 'workouts']

    Promise.all(
      endpoints.map((endpoint) =>
        fetch(`${apiBaseUrl}/api/${endpoint}`).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load ${endpoint}`)
          }

          return response.json()
        }),
      ),
    )
      .then(([users, activities, teams, leaderboard, workouts]) => {
        setData({ users, activities, teams, leaderboard, workouts })
        setStatus('Live data connected')
      })
      .catch(() => {
        setStatus('Showing sample data until the API and MongoDB are running')
      })
  }, [apiBaseUrl])

  return { apiBaseUrl, data, status }
}

function Layout({ children, status }) {
  const links = [
    ['/', 'Dashboard'],
    ['/profiles', 'Profiles'],
    ['/activities', 'Activities'],
    ['/teams', 'Teams'],
    ['/leaderboard', 'Leaderboard'],
    ['/workouts', 'Workouts'],
  ]

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary" to="/">
            <img src={logo} alt="OctoFit Tracker logo" width="42" height="42" />
            OctoFit Tracker
          </Link>
          <div className="navbar-nav flex-row flex-wrap gap-2">
            {links.map(([to, label]) => (
              <NavLink className="nav-link px-2" end={to === '/'} key={to} to={to}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      <main className="container py-4">
        <div className="alert alert-info py-2" role="status">
          {status}
        </div>
        {children}
      </main>
    </>
  )
}

function Dashboard({ data, apiBaseUrl }) {
  const totalPoints = data.leaderboard.reduce((sum, entry) => sum + Number(entry.totalPoints || 0), 0)
  const studentCount = data.users.filter((user) => user.role === 'student').length

  return (
    <>
      <section className="hero-card rounded-4 p-4 p-lg-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-8 text-start">
            <p className="text-uppercase fw-bold text-primary mb-2">Mergington High School</p>
            <h1 className="display-5 fw-bold">Keep students active with friendly fitness competition.</h1>
            <p className="lead mb-4">
              Mr. Paul can monitor progress, build teams, celebrate leaders, and recommend workouts from one
              social fitness dashboard.
            </p>
            <Link className="btn btn-primary btn-lg" to="/activities">
              Log activity progress
            </Link>
          </div>
          <div className="col-lg-4 text-center">
            <img className="hero-logo" src={logo} alt="" />
          </div>
        </div>
      </section>

      <div className="row g-3 mb-4">
        <Metric label="Students" value={studentCount} />
        <Metric label="Teams" value={data.teams.length} />
        <Metric label="Activities" value={data.activities.length} />
        <Metric label="Points earned" value={totalPoints} />
      </div>

      <div className="card shadow-sm">
        <div className="card-body text-start">
          <h2 className="h4">API connection</h2>
          <p className="mb-0">Frontend expects the logic tier at {apiBaseUrl}.</p>
        </div>
      </div>
    </>
  )
}

function Metric({ label, value }) {
  return (
    <div className="col-6 col-lg-3">
      <div className="card metric-card h-100 shadow-sm">
        <div className="card-body">
          <div className="fs-2 fw-bold text-primary">{value}</div>
          <div className="text-muted">{label}</div>
        </div>
      </div>
    </div>
  )
}

function Profiles({ users }) {
  return (
    <Page title="User profiles" subtitle="Students and gym teachers can track goals and progress.">
      <div className="row g-3">
        {users.map((user) => (
          <div className="col-md-6 col-xl-4" key={user._id || user.email}>
            <div className="card h-100 shadow-sm text-start">
              <div className="card-body">
                <span className="badge text-bg-primary text-capitalize mb-3">{user.role}</span>
                <h3 className="h5">{user.name}</h3>
                <p className="text-muted mb-2">{user.grade ? `Grade ${user.grade}` : 'Gym teacher'}</p>
                <p className="mb-0">{user.fitnessGoal}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}

function Activities({ activities }) {
  return (
    <Page title="Activity tracking" subtitle="Monitor workouts, duration, distance, and points.">
      <div className="table-responsive card shadow-sm">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Student</th>
              <th>Activity</th>
              <th>Duration</th>
              <th>Distance</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.user?.name || 'Student'}</td>
                <td className="text-capitalize">{activity.type}</td>
                <td>{activity.durationMinutes} min</td>
                <td>{activity.distanceMiles ? `${activity.distanceMiles} mi` : '—'}</td>
                <td className="fw-bold">{activity.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}

function Teams({ teams }) {
  return (
    <Page title="Team management" subtitle="Create collaborative goals and compare team performance.">
      <div className="row g-3">
        {teams.map((team) => (
          <div className="col-lg-6" key={team._id}>
            <div className="card h-100 shadow-sm text-start">
              <div className="card-body">
                <div className="d-flex justify-content-between gap-3">
                  <h3 className="h5">{team.name}</h3>
                  <span className="badge text-bg-success align-self-start">{team.points} pts</span>
                </div>
                <p>{team.goal}</p>
                <p className="text-muted mb-0">
                  Members: {(team.members || []).map((member) => member.name).join(', ') || 'Recruiting'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}

function Leaderboard({ leaderboard }) {
  return (
    <Page title="Competitive leaderboard" subtitle="Rank student performance with points and consistency.">
      <div className="list-group shadow-sm text-start">
        {leaderboard.map((entry) => (
          <div className="list-group-item d-flex align-items-center justify-content-between gap-3" key={entry._id}>
            <div>
              <span className="leader-rank me-3">#{entry.rank}</span>
              <strong>{entry.user?.name || 'Student'}</strong>
              <span className="text-muted ms-2">{entry.user?.grade ? `Grade ${entry.user.grade}` : ''}</span>
            </div>
            <div className="text-end">
              <div className="fw-bold">{entry.totalPoints} pts</div>
              <small className="text-muted">{entry.activitiesLogged} activities</small>
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}

function Workouts({ workouts }) {
  return (
    <Page title="Personalized workout suggestions" subtitle="Offer workouts tailored to level, focus, and goals.">
      <div className="row g-3">
        {workouts.map((workout) => (
          <div className="col-md-6 col-xl-3" key={workout._id}>
            <div className="card h-100 shadow-sm text-start">
              <div className="card-body">
                <span className="badge text-bg-warning text-capitalize mb-3">{workout.level}</span>
                <h3 className="h5">{workout.title}</h3>
                <p className="text-primary fw-semibold mb-1">{workout.focus}</p>
                <p className="text-muted">{workout.durationMinutes} minutes</p>
                <p className="mb-0">{workout.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}

function Page({ title, subtitle, children }) {
  return (
    <section className="text-start">
      <div className="mb-4">
        <h1 className="h2 fw-bold">{title}</h1>
        <p className="lead text-muted">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function App() {
  const { apiBaseUrl, data, status } = useOctofitData()

  return (
    <Layout status={status}>
      <Routes>
        <Route path="/" element={<Dashboard apiBaseUrl={apiBaseUrl} data={data} />} />
        <Route path="/profiles" element={<Profiles users={data.users} />} />
        <Route path="/activities" element={<Activities activities={data.activities} />} />
        <Route path="/teams" element={<Teams teams={data.teams} />} />
        <Route path="/leaderboard" element={<Leaderboard leaderboard={data.leaderboard} />} />
        <Route path="/workouts" element={<Workouts workouts={data.workouts} />} />
      </Routes>
    </Layout>
  )
}

export default App
