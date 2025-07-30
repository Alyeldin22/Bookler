import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const dbPath = path.join(process.cwd(), 'booking-db.json');
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(data);
    

    const bestOffers = (db.hotels || [])
      .map(hotel => {

        const bestPricing = hotel.pricing.reduce((best, current) => {
          const currentDiscount = ((current.originalPrice - current.discountedPrice) / current.originalPrice) * 100;
          const bestDiscount = ((best.originalPrice - best.discountedPrice) / best.originalPrice) * 100;
          return currentDiscount > bestDiscount ? current : best;
        });
        
        return {
          id: hotel.id,
          name: hotel.name,
          discount: bestPricing.discount,
          originalPrice: bestPricing.originalPrice,
          discountedPrice: bestPricing.discountedPrice,
          currency: bestPricing.currency,
          roomType: bestPricing.roomType,
          image: hotel.images.main,
          rating: hotel.rating,
          address: hotel.address
        };
      })
              .sort((a, b) => {
          const aDiscount = ((a.originalPrice - a.discountedPrice) / a.originalPrice) * 100;
          const bDiscount = ((b.originalPrice - b.discountedPrice) / b.originalPrice) * 100;
          return bDiscount - aDiscount;
        })
        .slice(0, 10);
    
    res.status(200).json(bestOffers);
  } catch (error) {
    console.error('Error reading booking-db.json:', error);
    res.status(500).json({ error: 'Failed to load best offers data.' });
  }
} 