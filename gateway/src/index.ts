import express, { Express, Request, Response } from 'express';
import expressProxy from 'express-http-proxy';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();
const app: Express = express();

const PORT = process.env.PORT || 9756;

app.use(bodyParser.json());
app.use(cors());

app.use('/user', expressProxy('http://localhost:3001'));
app.use('/driver', expressProxy('http://localhost:3002'));
app.use('/ride', expressProxy('http://localhost:3003'));

app.get('/', (req: Request, res: Response) => {
  res.send('Gateway is up and running!');
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
