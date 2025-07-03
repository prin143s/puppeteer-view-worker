const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Puppeteer Worker is running");
});

app.post("/view", async (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).send("No URL provided");

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
    await page.waitForTimeout(8000); // wait for view to count
    await browser.close();

    res.status(200).send("✅ View sent");
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).send("❌ View failed");
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Puppeteer Worker running");
});
