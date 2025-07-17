import app from './app.js';
import cors from "cors";

const allowedOrigins = [
  'https://hot-wheels-site.vercel.app',
  'http://localhost:3002'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
}); 