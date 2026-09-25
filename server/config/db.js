import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car-rental',
            {
                serverSelectionTimeoutMS: 5000
            }
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
        return true;
    } catch (error) {
        console.error(`MongoDB Connection Notice: ${error.message}`.yellow.bold);
        console.log('\n=============================================================');
        console.log('📌 MongoDB Status Notice:');
        console.log('Could not connect to MongoDB at: ' + (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car-rental'));
        console.log('');
        console.log('Options to connect database:');
        console.log('1. If running locally, start MongoDB service (e.g. "net start MongoDB" or "mongod")');
        console.log('2. If using MongoDB Atlas cloud:');
        console.log('   Add your connection string in server/.env:');
        console.log('   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/car-rental');
        console.log('=============================================================\n');
        return false;
    }
};

export default connectDB;
