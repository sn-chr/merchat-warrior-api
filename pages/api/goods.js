import { getAllGoods, initDB } from '../../db';

export default async function handler(req, res) {
  try {
    // Make sure DB is initialized
    await initDB();
    const goods = await getAllGoods();

    console.log('Goods:', goods);
    
    if (!goods || goods.length === 0) {
      console.log('No goods found, reinitializing DB...');
      await initDB();
      const retryGoods = await getAllGoods();
      res.status(200).json(retryGoods);
    } else {
      res.status(200).json(goods);
    }
  } catch (error) {
    console.error('Error fetching goods:', error);
    res.status(500).json({ error: 'Failed to fetch goods' });
  }
} 