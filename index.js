import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const FCM_URL = "https://fcm.googleapis.com/fcm/send";
const SERVER_KEY = process.env.FCM_SERVER_KEY;

app.post("/kirim-notifikasi", async (req, res) => {
  const { fcmToken, title, body } = req.body;

  if (!fcmToken || !title || !body) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  const payload = {
    notification: {
      title,
      body
    },
    to: fcmToken
  };

  try {
    const response = await fetch(FCM_URL, {
      method: "POST",
      headers: {
        Authorization: `key=${SERVER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("✅ Notifikasi dikirim:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Gagal kirim:", err);
    res.status(500).json({ error: "Gagal kirim notifikasi" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server notifikasi berjalan di http://localhost:${PORT}`);
});
