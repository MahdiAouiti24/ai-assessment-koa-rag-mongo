import 'dotenv/config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { logger } from './utils/logger.js';
import askRouter from './routes/ask.js';

const app = new Koa();
app.use(cors());
app.use(bodyParser());
app.use(askRouter.routes());
app.use(askRouter.allowedMethods());

const port = Number(process.env.PORT || 3000);
app.listen(port, () => logger.info(`Server listening on http://localhost:${port}`));
