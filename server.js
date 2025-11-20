import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const TOKEN = process.env.VK_TOKEN; // токен VK
const GROUP_ID = "-39760212";       // ID вашей группы

app.get("/posts", async (req, res) => {
  try {
    const url = `https://api.vk.com/method/wall.get?owner_id=${GROUP_ID}&count=10&access_token=${TOKEN}&v=5.131`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`VK Proxy running on port ${PORT}`));
