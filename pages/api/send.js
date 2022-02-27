import { send } from '../../lib/sendEmail';
import { config } from '../../config';

export default async (req, res) => {
  const { to, content } = req.query;
  let result = 'OK';

  if (to && content) {
    try {
      const queue = Buffer.from(JSON.stringify({ to, content }));

      const open = await require('amqplib').connect(process.env.CLOUDAMQP_URL);
      const ch = await open.createChannel();
      await ch.assertQueue(config.queue);

      // Publisher
      ch.sendToQueue(config.queue, queue);

      // Consumer
      await ch.consume(config.queue, function (msg) {
        if (msg !== null) {
          const { to, content } = JSON.parse(msg.content.toString());
          console.log({ to, content })
          send({ to, content });
          ch.ack(msg);
        }
      });
    } catch (error) {
      result = error.toString();
    }
  } else {
    result = 'missing to/content params';
  }

  res.statusCode = 200
  res.json({ response: result })
}
