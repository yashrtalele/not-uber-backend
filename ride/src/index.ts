import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 9759;
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Ride service is up and running!');
});

app.listen(PORT, () => {
  console.log(`Ride service listening on port ${PORT}`);
});
