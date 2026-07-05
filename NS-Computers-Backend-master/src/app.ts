import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './db/DBConnection';
import { env } from './config/env.config';
import { errorHandler, notFound } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import { authenticateToken } from './middleware/auth.middleware';
import contactRoutes from "./routes/contact.routes";


config();

const app: Express = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true
}));


app.get('/api/health', (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState;
  let dbStatusText = '';

  switch(dbStatus) {
    case 0: dbStatusText = 'disconnected'; break;
    case 1: dbStatusText = 'connected'; break;
    case 2: dbStatusText = 'connecting'; break;
    case 3: dbStatusText = 'disconnecting'; break;
    default: dbStatusText = 'unknown';
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    database: {
      status: dbStatusText,
      connection: process.env.MONGO_URI ? 'Configured' : 'Not configured',
      dbName: mongoose.connection.db?.databaseName || 'Not connected'
    },
    uptime: process.uptime()
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/users',  userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);


app.use(notFound);


app.use(errorHandler);


const PORT = env.PORT || 3000; 

const startServer = async () => {
  try {
    
    try {
      await connectDB();
    } catch (dbError) {
      console.error('❌ Failed to connect to database:', dbError instanceof Error ? dbError.message : 'Unknown error');
      process.exit(1);
    }

    
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health\n`);
    });

    
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error;

      
      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`Port ${PORT} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    
    process.on('SIGINT', () => {
      console.log('\nGracefully shutting down from SIGINT (Ctrl+C)');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    if (env.NODE_ENV === 'development') {
      console.log(`🚀 Starting in ${env.NODE_ENV} mode`);
    }
    console.error('❌ Failed to start server:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

export { startServer };
export default app;