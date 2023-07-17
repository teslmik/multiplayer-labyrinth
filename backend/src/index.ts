import express from 'express';

const PORT = 5001;
const app = express();

app.use(express.json());
app.get('/', (_, res) => res.send('Hello world!'));

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();