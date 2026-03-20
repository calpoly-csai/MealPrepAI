import 'dotenv/config';
import createApp from './app';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start the Express server
 */
async function startServer() {
  try {
    const app = createApp();

    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`🚀 MealPrepAI Backend Server Started`);
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`📍 Server running at http://localhost:${PORT}`);
      console.log(`🔧 Environment: ${NODE_ENV}`);
      console.log(`⚙️  Port: ${PORT}`);
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('');
      console.log('Available endpoints:');
      console.log(`  GET  http://localhost:${PORT}/                    - API Info`);
      console.log(`  GET  http://localhost:${PORT}/api/health          - Health Check`);
      console.log(`  GET  http://localhost:${PORT}/api/auth/me         - Get Current User (auth required)`);
      console.log(`  POST http://localhost:${PORT}/api/auth/verify     - Verify Auth (auth required)`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// Start the server
startServer();
