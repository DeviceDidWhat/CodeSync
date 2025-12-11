import express from 'express';
import dotenv from 'dotenv';
import { ENV } from './env.js';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Server is running' });
})
app.listen(ENV.PORT, () => {
  console.log('Server is running on port 3000');
});