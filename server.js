const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for the main page (index.html is served automatically by express.static, 
// but this ensures any request goes to the main app if not a static file)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`\n✅ Math Mastery App server running at http://localhost:${port}`);
  console.log(`\nPress CTRL+C to stop the server.`);
});