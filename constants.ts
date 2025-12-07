

import { RoutePrice, VehicleSpecs, VehicleType } from './types';
import { Car, Truck, Crown, Bus } from 'lucide-react';

export const LOCATIONS = [
  "Singapore - Changi Airport",
  "Singapore - City / Hotel",
  "Singapore - Residential",
  "Johor Bahru - City / JB Sentral",
  "Johor Bahru - Senai Airport",
  "Johor Bahru - Legoland",
  "Johor Bahru - Desaru",
  "Johor Bahru - Mersing Jetty",
  "Malacca",
  "Kuala Lumpur - City Center",
  "Kuala Lumpur - KLIA 1/2",
  "Genting Highlands"
];

// Configuration for Dynamic Pricing
export const SURCHARGE_CONFIG = {
  PEAK_MULTIPLIER: 1.30,    // 30% extra on special dates
};

// Example Peak Dates (YYYY-MM-DD)
export const PEAK_DATES = [
  '2024-12-24', '2024-12-25', '2024-12-31',
  '2025-01-01', '2025-01-29', '2025-01-30' // CNY
];

export const VEHICLES: VehicleSpecs[] = [
  {
    type: VehicleType.SEDAN,
    maxPax: 4,
    maxLuggage: 2, // 2 large
    description: "Ideal for couples or small families with light luggage. Comfortable and economical.",
    image: "https://d1g6w7sntckt92.cloudfront.net/public/images/car_image/ii2KJXunE2KEqONrTOSLgcyN3wtJgxxhrA4kStZ0.webp"
  },
  {
    type: VehicleType.MPV_STD,
    maxPax: 7,
    maxLuggage: 4, // Mixed
    description: "Toyota Innova or Perodua Aruz. Great for families with extra luggage space.",
    image: "https://www.bigwheels.my/wp-content/uploads/2021/04/Perodua-Aruz.jpg"
  },
  {
    type: VehicleType.MPV_LUX,
    maxPax: 6,
    maxLuggage: 5,
    description: "Toyota Alphard / Vellfire. VIP comfort with pilot seats and premium legroom.",
    image: "https://global.toyota/pages/news/images/2023/06/21/1330/002.jpg"
  },
  {
    type: VehicleType.VAN,
    maxPax: 9,
    maxLuggage: 7,
    description: "Hyundai Starex or similar. Spacious Multi-Purpose Vehicle for larger groups.",
    image: "https://mytripmalaysia.com/wp-content/uploads/2024/04/%E7%8E%B0%E4%BB%A3%E8%BE%89%E7%BF%BC%E5%86%85%E9%A5%B0.jpg"
  }
];

// Simplified Pricing Logic for Demo purposes
// In a real app, this might come from a backend or a more complex matrix
export const PRICING_MATRIX: RoutePrice[] = [
  // FROM SINGAPORE
  {
    from: "Singapore",
    to: "Johor Bahru",
    prices: {
      [VehicleType.SEDAN]: 280,
      [VehicleType.MPV_STD]: 320,
      [VehicleType.MPV_LUX]: 480,
      [VehicleType.VAN]: 550
    }
  },
  {
    from: "Singapore",
    to: "Legoland",
    prices: {
      [VehicleType.SEDAN]: 300,
      [VehicleType.MPV_STD]: 350,
      [VehicleType.MPV_LUX]: 500,
      [VehicleType.VAN]: 600
    }
  },
  {
    from: "Singapore",
    to: "Malacca",
    prices: {
      [VehicleType.SEDAN]: 750,
      [VehicleType.MPV_STD]: 850,
      [VehicleType.MPV_LUX]: 1100,
      [VehicleType.VAN]: 1200
    }
  },
  {
    from: "Singapore",
    to: "Kuala Lumpur",
    prices: {
      [VehicleType.SEDAN]: 1000,
      [VehicleType.MPV_STD]: 1100,
      [VehicleType.MPV_LUX]: 1350,
      [VehicleType.VAN]: 1450
    }
  },
  {
    from: "Singapore",
    to: "Genting",
    prices: {
      [VehicleType.SEDAN]: 1200,
      [VehicleType.MPV_STD]: 1300,
      [VehicleType.MPV_LUX]: 1550,
      [VehicleType.VAN]: 1650
    }
  },
  // FROM JB
  {
    from: "Johor Bahru",
    to: "Kuala Lumpur",
    prices: {
      [VehicleType.SEDAN]: 700,
      [VehicleType.MPV_STD]: 800,
      [VehicleType.MPV_LUX]: 1000,
      [VehicleType.VAN]: 1100
    }
  },
  {
    from: "Johor Bahru",
    to: "Genting",
    prices: {
      [VehicleType.SEDAN]: 750,
      [VehicleType.MPV_STD]: 800,
      [VehicleType.MPV_LUX]: 1050,
      [VehicleType.VAN]: 1200
    }
  }
];

export const WHATSAPP_NUMBER = "60188706966"; 

export const TESTIMONIALS = [
  {
    name: "Jason Lim",
    route: "SG to KL",
    text: "Very professional driver. The Alphard was clean and super comfortable for my elderly parents. Smooth customs clearance.",
    stars: 5
  },
  {
    name: "Sarah Chen",
    route: "SG to Legoland",
    text: "Hassle-free experience with kids. Door to door service meant we didn't have to drag luggage through customs. Highly recommended!",
    stars: 5
  },
  {
    name: "Mike T.",
    route: "JB to Genting",
    text: "Reasonable price and safe driving. Will definitely book again for our next trip.",
    stars: 5
  }
];

export const FAQS = [
  {
    q: "Does the price include toll charges and petrol?",
    a: "Yes! Our prices are all-inclusive. This covers the vehicle, driver, petrol, and all toll charges/checkpoint fees. No hidden costs."
  },
  {
    q: "Do we need to get off the car at customs?",
    a: "No. You stay comfortably in the car for both Singapore and Malaysia immigration checkpoints. We handle the drive-through lane."
  },
  {
    q: "How do I pay?",
    a: "We accept PayNow, Bank Transfer, or Cash to Driver (in RM or SGD) upon arrival at your destination. A small deposit may be required for peak season bookings."
  }
];