import express from 'express';
const app = express();
const port = 3000;

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});