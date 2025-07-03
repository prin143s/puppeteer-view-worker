const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/view', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.json({ success: false, error: "Missing URL" });

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5s
    await browser.close();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(10000, () => {
  console.log("✅ Puppeteer worker running on port 10000");
});
