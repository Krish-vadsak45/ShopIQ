import express from 'express';
import cors from 'cors';
import { analyzeReviews } from './lib/ai';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/analyze-reviews', async (req, res) => {
  try {
    const { productName, price, reviews } = req.body;

    if (!productName || typeof productName !== 'string' || !productName.trim()) {
      return res.status(400).json({ success: false, error: 'Invalid product name' });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid price' });
    }
    if (!reviews || typeof reviews !== 'string' || !reviews.trim()) {
      return res.status(400).json({ success: false, error: 'Invalid reviews' });
    }

    const result = await analyzeReviews(productName, price, reviews);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('Analysis error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`ShopIQ backend listening on port ${PORT}`);
});
