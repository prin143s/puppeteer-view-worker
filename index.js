import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());

app.post("/view", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, error: "No URL provided" });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });

    const page = await browser.newPage();

    // 🧠 Add real browser headers
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    await page.setViewport({ width: 1366, height: 768 });

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000  // 🕒 30s timeout
    });

    await page.waitForTimeout(3000); // Wait for view to count
    await browser.close();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
