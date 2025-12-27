import express from "express";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());

app.get("/", (_, res) => {
  res.status(200).send("OK");
});

app.post("/render", async (req, res) => {
  try {
    const { template, slide1, slide2 } = req.body;

    if (template !== "money_magnet_v1") {
      return res.status(400).json({ error: "Invalid template" });
    }

    if (!slide1?.heading || !slide1?.hook) {
      return res.status(400).json({
        error: "Slide 1 requires heading and hook"
      });
    }

    if (!slide2?.statement || !slide2?.cta) {
      return res.status(400).json({
        error: "Slide 2 requires statement and cta"
      });
    }

    // 🔹 This is where image generation happens
    // You already handle SVG / HTML → image here

    const imageUrl = `https://your-render-domain.com/output/${Date.now()}.png`;

    return res.status(200).json({
      status: "ready",
      image_url: imageUrl,
      slides: {
        slide1,
        slide2
      }
    });

  } catch (err) {
    return res.status(500).json({
      error: "Render failure",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Render service running on ${PORT}`);
});
