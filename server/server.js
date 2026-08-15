import { faker } from '@faker-js/faker';
import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
import { v4 as uuid } from 'uuid';

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 7070;

function generateMessages() {
  const count = faker.number.int({ min: 0, max: 3});
  const messages = [];

  for (let i = 0; i < count; i++) {
    const nowTime = Math.floor(Date.now() / 1000);
    const receivedTimeMsg = nowTime - faker.number.int({ min: 60, max: 3600 * 24 * 7 });

    messages.push({
      id: uuid(),
      from: faker.internet.email(),
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(),
      received: receivedTimeMsg
    });
  }

  return messages;
}

router.get('/messages/unread', async (ctx) => {
  const messages = generateMessages();
  const timestamp = Math.floor(Date.now() / 1000);

  ctx.body = {
    status: 'ok',
    timestamp: timestamp,
    messages: messages
  }
});

app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`сервер запустился на http://localhost:${port}`);
});