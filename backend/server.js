// import mongoose from "mongoose";
import cors from 'cors';
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
import express from 'express';
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from './routes/dashboardRoutes.js';  
import progressRoutes from './routes/progressRoutes.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();






app.get('/',(req,res)=>{
    res.json({message:"it is running successfully"})
})




app.use('/api/users',userRoutes)
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/progress', progressRoutes);



const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`it is running on port ${port}`)
})