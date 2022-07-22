import { send } from '../../lib/sendEmail';

export default async (req, res) => {
  const { to, content, title } = req.query;
  let result = 'OK';

  if (to && content) {
    try {
      result = await send({ to, content, title });
    } catch (error) {
      result = error.toString();
    }
  } else {
    result = 'missing to/content params';
  }

  res.statusCode = 200
  res.json({ response: result })
}
