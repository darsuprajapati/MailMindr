const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const reminderRoutes = require('./routes/reminders');
const adminRoutes = require('./routes/admin');
require('./utils/emailScheduler');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
   origin: [process.env.CLIENT_URL ||'http://localhost:5173','https://mail-mindr-auto.vercel.app'], 
   credentials: true 
  }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Automated Email Reminders API');
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`)); 

// ✅ Export app for Vercel
export default app