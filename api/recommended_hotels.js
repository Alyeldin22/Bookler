import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const dbPath = path.join(process.cwd(), 'booking-db.json');
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(data);
    res.status(200).json(db.recommended_hotels || []);
  } catch (error) {
    console.error('Error reading booking-db.json:', error);
    res.status(500).json({ error: 'Failed to load recommended hotels data.' });
  }
} 