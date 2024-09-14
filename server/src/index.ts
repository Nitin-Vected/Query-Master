import express from 'express';
import cors from 'cors';
import { connectDB } from './model/connection';
import userRouter from './routes/userRouter';
import { PORT } from './config';
import adminRouter from './routes/adminRouter';
const app = express();

connectDB();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/user',userRouter);
app.use('/admin',adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});