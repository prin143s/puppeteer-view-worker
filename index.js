const express = require("express");
const { chromium } = require("playwright");

const app = express();
app.use(express.json());

app.post("/view", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.json({ success: false, error: "Missing URL" });

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(5000); // wait for view to register
    await browser.close();
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log("✅ View worker running");
});
