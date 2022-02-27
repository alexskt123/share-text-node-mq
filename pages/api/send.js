import { send } from '../../lib/sendEmail';
import { config } from '../../config';

export default async (req, res) => {
  const { to, content } = req.query
  const open = require('amqplib').connect(process.env.CLOUDAMQP_URL);

  // Publisher
  open.then(function (conn) {
    return conn.createChannel();
  }).then(function (ch) {
    return ch.assertQueue(config.queue).then(function (ok) {
      return ch.sendToQueue(config.queue, Buffer.from(content));
    });
  }).catch(console.warn);

  // Consumer
  open.then(function (conn) {
    return conn.createChannel();
  }).then(function (ch) {
    return ch.assertQueue(config.queue).then(function (ok) {
      return ch.consume(config.queue, function (msg) {
        if (msg !== null) {
          send({ to, msg });
          ch.ack(msg);
        }
      });
    });
  }).catch(console.warn);

  res.statusCode = 200
  res.json({ response: 'OK' })
}
