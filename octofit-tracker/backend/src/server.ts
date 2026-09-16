import './config/database.js';
import app from './app.js';

const port = Number(process.env.PORT) || 8000;

app.listen(port, () => {
  console.log(`OctoFit Tracker API listening on port ${port}`);
});
