import mongoose, { ConnectOptions } from 'mongoose';
import { config } from 'dotenv';

config();


interface MongoError extends Error {
    codeName?: string;
    code?: number | string;
}

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ns-computers';

        
        mongoose.connection.on('connected', () => {
            if (mongoose.connection.db) {
                console.log(`✅ MongoDB connected to database: ${mongoose.connection.db.databaseName}`);
            } else {
                console.log('✅ MongoDB connected');
            }
        });

        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error.message);
        });

const connectDB = async (): Promise<string> => {
    try {
        if (!DB_URI) {
            throw new Error('MongoDB connection string is not defined in environment variables');
        }
        
        
        if (!process.env.DB_CONNECTION_LOGGED) {
            const maskedUri = DB_URI.replace(/:[^:]+@/, ':***@');
            console.log(`🔌 Connecting to MongoDB at ${maskedUri}...`);
            process.env.DB_CONNECTION_LOGGED = 'true';
        }

        
        const options: ConnectOptions = {
            serverSelectionTimeoutMS: 10000, 
            socketTimeoutMS: 45000, 
            family: 4, 
            retryWrites: true,
            w: 'majority'
        };

        await mongoose.connect(DB_URI, options);
        
        
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Failed to get database instance');
        }
        
        
        const collections = await db.listCollections({ name: 'users' }).toArray();
        if (collections.length === 0) {
            console.log('Users collection does not exist, creating a new one');
            await db.createCollection('users');
        } else {
            console.log('Using existing users collection');
        }
        
        
        await mongoose.connection.syncIndexes();
        console.log('Ensured indexes are up to date with the current schema');

        return `MongoDB connected successfully to database "${db.databaseName}"`;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
