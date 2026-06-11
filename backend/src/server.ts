import app from './app';
import { env } from './config/env';
import { testDbConnection } from './config/database';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    // Verify database connection
    await testDbConnection();

    const port = env.PORT || 5000;
    app.listen(port, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
