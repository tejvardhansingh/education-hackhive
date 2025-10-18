import mongoose from 'mongoose';

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.mongo_url);
        console.log('Database connected succesfully')
    }catch(err){
        console.log('message',err)
        process.exit(1)
    }
}

export default connectDB;