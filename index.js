import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 10000;

// Главная проверка сервера
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Рабочий маршрут для VK постов
app.get('/api/posts', async (req, res) => {
  const { id, count = 5, access_token } = req.query;

  if (!id || !access_token) {
    return res.status(400).json({ error: "Не указан id группы или access_token" });
  }

  try {
    const vkUrl = `https://api.vk.com/method/wall.get?owner_id=${id}&count=${count}&access_token=${access_token}&v=5.131`;
    const response = await fetch(vkUrl);
    const data = await response.json();

    if (data.error) return res.status(400).json({ error: data.error });

    res.json({ posts: data.response.items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
