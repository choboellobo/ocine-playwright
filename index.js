const express = require('express');
const ocine = require('./ocine');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get('/cartelera', async (req, res) => {
  const result = await ocine.main();
  res.json(result);
});

// Start the server 
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
