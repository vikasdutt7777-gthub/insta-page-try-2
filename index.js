import express from "express";
import cors from "cors";

const app = express();

/* ===============================
   GLOBAL MIDDLEWARE
================================ */
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.disable("etag");

/* ===============================
   HEALTH CHECK (RENDER COLD START)
================================ */
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

/* ===============================
   RENDER ENDPOINT
================================ */
app.post("/render", (req, res) => {
  try {
    const {
      template,
      slide,

      // SLIDE 1
      heading,
      hook,

      // SLIDE 2
      statement,
      cta
    } = req.body;

    /* -------- HARD VALIDATION -------- */
    if (template !== "money_magnet_v1") {
      return res.status(403).json({ error: "Invalid template" });
    }

    if (![1, 2].includes(slide)) {
      return res.status(400).json({ error: "Slide must be 1 or 2" });
    }

    /* -------- FIXED BRAND ELEMENTS -------- */
    const brand = {
      left_logo: "MONEY MAGNET 04",
      right_logo: "MONEY MAGNET 04",
      center_text: "ACHIEVE MORE",
      logo_opacity: 0.35
    };

    /* -------- SLIDE PAYLOAD -------- */
    let payload;

    if (slide === 1) {
      if (!heading || !hook) {
        return res.status(400).json({
          error: "Slide 1 requires heading and hook"
        });
      }

      payload = {
        slide: 1,
        brand,
        heading,
        hook
      };
    }

    if (slide === 2) {
      if (!statement || !cta) {
        return res.status(400).json({
          error: "Slide 2 requires statement and cta"
        });
      }

      payload = {
        slide: 2,
        brand,
        statement,
        cta
      };
    }

    return res.status(200).json({
      status: "ready",
      payload
    });

  } catch (err) {
    return res.status(500).json({
      error: "Render failure",
      message: err.message
    });
  }
});

/* ===============================
   PORT BINDING
================================ */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Image render engine running on port ${PORT}`);
});
