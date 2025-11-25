const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/api/posts", async (req, res) => {
  const { id, count, access_token } = req.query;
  if (!id || !count || !access_token) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const vkUrl = `https://api.vk.com/method/wall.get?owner_id=${id}&count=${count}&access_token=${access_token}&v=5.131`;
    const vkRes = await fetch(vkUrl);
    const vkData = await vkRes.json();

    const posts = (vkData.response.items || []).map(post => {
      // Если текста нет, собираем его из attachments
      let text = post.text || "";
      if (!text && post.attachments) {
        post.attachments.forEach(att => {
          if (att.video) text += (text ? "\n\n" : "") + att.video.title;
          if (att.photo) text += (text ? "\n\n" : "") + "Фото";
        });
      }
      return { ...post, text };
    });

    res.json({ posts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "VK API error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
