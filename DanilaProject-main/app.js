import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import authRouter from './src/route/authRoute.js';
import userRouter from './src/route/userRoute.js';
import teamRouter from './src/route/teamRoute.js';
import gameRouter from './src/route/gameRoute.js';
import betRouter from './src/route/betRoute.js';
import adminRouter from './src/route/adminRoute.js';
import categoryRouter from './src/route/categoryRoute.js';
import { deleteImg, upload } from './src/util/files.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.post('/upload', (req, res) => {
  try {
    upload(req, res, () => {
      res.send(`uploads/${req.file.filename}`);
    });
  } catch(error) {
    console.error('Error:', error);
    res.status(500).send('Error uploading file');
  }
});

app.post('/deleteImg', (req, res) => {
  const { path } = req.body;

  deleteImg(path);
});

// Serve the uploaded files statically
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/team', teamRouter);
app.use('/game', gameRouter);
app.use('/bet', betRouter);
app.use('/admin', adminRouter);
app.use('/categories', categoryRouter);

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    } else {
        console.log("Error occurred, server can't start", error);
    }
});
