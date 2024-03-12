const { app } = require('./src/app');
const { connectToDatabase } = require('./src/database/connection');
require('dotenv').config();

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

// Connect to database
connectToDatabase();

app.listen(PORT, async () => {
  console.log('Server is running on port ' + PORT);
});