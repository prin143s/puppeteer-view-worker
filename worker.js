const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
app.use(express.json());

app.post("/view", async (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).send("No URL provided");

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
    await page.waitForTimeout(8000); // wait so Telegram counts view
    await browser.close();

    res.status(200).send("✅ View sent");
  } catch (err) {
    console.error("Error sending view:", err.message);
    res.status(500).send("❌ View failed");
  }
});

app.get("/", (req, res) => res.send("👀 Puppeteer Worker Running"));
app.listen(process.env.PORT || 5000);
