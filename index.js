const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

app.post("/view", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.json({ success: false, error: "URL missing" });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
    await page.waitForTimeout(5000);
    await browser.close();

    res.json({ success: true });
  } catch (e) {
    console.error("Puppeteer Error:", e.message);
    res.json({ success: false, error: e.message });
  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log("✅ Puppeteer view worker running");
});
