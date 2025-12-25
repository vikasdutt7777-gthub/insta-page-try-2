import express from "express";
import cors from "cors";

const app = express();

/* =====================================
   GLOBAL MIDDLEWARE (STABILITY)
===================================== */
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.disable("etag");

/* =====================================
   HEALTH CHECK (RENDER COLD START FIX)
===================================== */
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

/* =====================================
   IMAGE RENDER ENDPOINT
   (TEXT → TEMPLATE PAYLOAD)
===================================== */
app.post("/render", (req, res) => {
  try {
    const {
      template,
      slide,

      // PAGE 1 (Slide 1)
      heading,
      hook,

      // PAGE 2 (Slide 2)
      statement,
      cta
    } = req.body;

    /* ---------- HARD GUARDS ---------- */
    if (template !== "money_magnet_v1") {
      return res.status(403).json({
        error: "Invalid template. Brand locked."
      });
    }

    if (![1, 2].includes(slide)) {
      return res.status(400).json({
        error: "Slide must be 1 or 2 only"
      });
    }

    /* ---------- FIXED BRAND ELEMENTS ---------- */
    const brand = {
      logo_text: "MONEY MAGNET 04",
      center_line: "ACHIEVE MORE",
      logo_opacity: 0.35
    };

    /* ---------- SLIDE LOGIC ---------- */
    let payload;

    // PAGE 1
    if (slide === 1) {
      if (!heading || !hook) {
        return res.status(400).json({
          error: "Slide 1 requires heading and hook"
        });
      }

      payload = {
        page: 1,
        brand,
        heading,
        hook
      };
    }

    // PAGE 2
    if (slide === 2) {
      if (!statement || !cta) {
        return res.status(400).json({
          error: "Slide 2 requires statement and cta"
        });
      }

      payload = {
        page: 2,
        brand,
        statement,
        cta
      };
    }

    /* ---------- RESPONSE ---------- */
    return res.status(200).json({
      status: "ready",
      payload
    });

  } catch (err) {
    return res.status(500).json({
      error: "Render engine failure",
      message: err.message
    });
  }
});

/* =====================================
   PORT (RENDER SAFE)
===================================== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Money Magnet render engine running on port ${PORT}`);
});
