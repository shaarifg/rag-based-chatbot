import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import config from './config/index.js';
import vectorStore from './database/vectorStore.js';
import database from './database/postgres.js';
import redisClient from './database/redis.js';
import { setupSocketHandlers } from './sockets/chatSocket.js';

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupSocketHandlers(io);

const startServer = async () => {
  try {
    // Initialize vector store
    await vectorStore.initialize();

    // Initialize database (optional)
    await database.initialize();

    httpServer.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🚀 RAG Backend Server Running        ║
║                                        ║
║   HTTP: http://localhost:${config.port}        ║
║   Socket.io: Enabled                   ║
║   Environment: ${config.nodeEnv.padEnd(16)}    ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close();
  await redisClient.close();
  await database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  httpServer.close();
  await redisClient.close();
  await database.close();
  process.exit(0);
});

startServer();
