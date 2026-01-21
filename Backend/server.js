require('dotenv').config();
const app = require('./src/app');
const { init_database } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const start_server = async () => {
  try {
    await init_database();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start_server();