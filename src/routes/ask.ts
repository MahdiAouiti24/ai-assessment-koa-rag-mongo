import Router from 'koa-router';
import type { AskRequestBody } from '../types.js';
import { askOrchestrator } from '../orchestrator.js';

const router = new Router();

router.post('/ask', async (ctx) => {
  const body = ctx.request.body as AskRequestBody;
  if (!body?.query) {
    ctx.status = 400;
    ctx.body = { error: 'Missing "query"' };
    return;
  }
  const result = await askOrchestrator(body.query);
  ctx.body = result;
});

export default router;
