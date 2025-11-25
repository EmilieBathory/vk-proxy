import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

// Включаем CORS для всех доменов (Tilda и другие)
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('VK Proxy Server is running!');
});

// Основной маршрут для получения постов
app.get('/api/posts', async (req, res) => {
  const { id, count = 5, access_token } = req.query;

  if (!id || !access_token) {
    return res.status(400).json({ error: "Укажите id и access_token" });
  }

  try {
    const vkUrl = `https://api.vk.com/method/wall.get?owner_id=${id}&count=${count}&access_token=${access_token}&v=5.131`;
    const vkRes = await fetch(vkUrl);
    const data = await vkRes.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    res.json({ posts: data.response.items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
