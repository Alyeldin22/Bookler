import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { id } = req.query;
  const dbPath = path.join(process.cwd(), 'booking-db.json');
  
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(data);
    

    const hotel = (db.hotels || []).find(h => h.id === id);
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error reading booking-db.json:', error);
    res.status(500).json({ error: 'Failed to load hotel data.' });
  }
} 