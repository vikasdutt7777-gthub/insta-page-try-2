const express = require("express");
const sharp = require("sharp");

const app = express();
app.use(express.json());
app.get("/test", async (req, res) => {
  const text = req.query.text || "DISCIPLINE BUILDS WEALTH";

  const svg = `
  <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#0b2b1e"/>
    <text x="40" y="70" fill="white" opacity="0.15" font-size="40">LOGO</text>
    <text x="1040" y="70" fill="white" opacity="0.15" font-size="40" text-anchor="end">LOGO</text>
    <text x="540" y="95" text-anchor="middle" fill="gold" opacity="0.4" font-size="22">
      ACHIEVE MORE
    </text>
    <foreignObject x="120" y="360" width="840" height="360">
      <div xmlns="http://www.w3.org/1999/xhtml"
           style="color:white;font-size:56px;font-family:Georgia,serif;text-align:center;">
        ${text}
      </div>
    </foreignObject>
  </svg>
  `;

  const image = await require("sharp")(Buffer.from(svg)).png().toBuffer();
  res.set("Content-Type", "image/png");
  res.send(image);
});

app.post("/render", async (req, res) => {
  try {
    const text = req.body.text || "DISCIPLINE BUILDS WEALTH";

    const svg = `
    <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0b2b1e"/>

      <!-- Logos -->
      <text x="40" y="70" fill="white" opacity="0.15" font-size="40">LOGO</text>
      <text x="1040" y="70" fill="white" opacity="0.15" font-size="40" text-anchor="end">LOGO</text>

      <!-- Center top text -->
      <text x="540" y="95" text-anchor="middle" fill="gold" opacity="0.4" font-size="22" letter-spacing="3">
        ACHIEVE MORE
      </text>

      <!-- Main text -->
      <foreignObject x="120" y="360" width="840" height="360">
        <div xmlns="http://www.w3.org/1999/xhtml"
             style="color:white;font-size:56px;font-family:Georgia,serif;text-align:center;line-height:1.3;">
          ${text}
        </div>
      </foreignObject>
    </svg>
    `;

    const image = await sharp(Buffer.from(svg)).png().toBuffer();
    res.set("Content-Type", "image/png");
    res.send(image);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Image renderer running on port", PORT);
});
