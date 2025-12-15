
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
  "Kota Tinggi",
  "Kluang",
  "Batu Pahat",
  "Yong Peng",
  "Muar",
  "Segamat",
  "Malacca",
  "Seremban",
  "Kuala Lumpur - City Area",
  "Kuala Lumpur - KLIA 1/2",
  "Genting Highlands",
  "Cameron Highlands",
  "Ipoh",
  "Setiawan",
  "Kampar",
  "Penang"
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
    paxLabel: "Max 4 Passenger",
    description: "Ideal for couples or small families with light luggage. Comfortable and economical.",
    image: "https://i.ibb.co/MkrMRGHP/4.png"
  },
  {
    type: VehicleType.MPV_STD,
    maxPax: 6,
    maxLuggage: 4, // Mixed
    paxLabel: "Max 6 Passenger",
    description: "Toyota Innova or Perodua Aruz. Great for families with extra luggage space.",
    image: "https://www.bigwheels.my/wp-content/uploads/2021/04/Perodua-Aruz.jpg"
  },
  {
    type: VehicleType.MPV_LUX,
    maxPax: 6,
    maxLuggage: 5,
    paxLabel: "Max 6-7 Passenger",
    description: "Toyota Alphard / Vellfire. VIP comfort with pilot seats and premium legroom.",
    image: "https://i.ibb.co/F1r3WqY/5.png"
  },
  {
    type: VehicleType.VAN,
    maxPax: 9,
    maxLuggage: 7,
    paxLabel: "Max 9 Passenger",
    description: "Hyundai Starex or similar. Spacious Multi-Purpose Vehicle for larger groups.",
    image: "https://i.ibb.co/TMhrqDFj/Gemini-Generated-Image-ayddmgayddmgaydd.png"
  }
];

const R = 3.2; // Rate used to store SGD prices as MYR in matrix, so (Value * 3.2) / 3.2 = Value SGD

export const PRICING_MATRIX: RoutePrice[] = [
  // --- FROM SINGAPORE ---
  
  // SG -> JB (Covers City, Senai, Legoland)
  // SGD: 90, 100, 120, 120
  {
    from: "Singapore",
    to: "Johor Bahru",
    prices: {
      [VehicleType.SEDAN]: 90 * R,
      [VehicleType.MPV_STD]: 100 * R,
      [VehicleType.MPV_LUX]: 120 * R,
      [VehicleType.VAN]: 120 * R
    }
  },
  // SG -> Kota Tinggi
  // SGD: 120, 140, 160, 160
  {
    from: "Singapore",
    to: "Kota Tinggi",
    prices: {
      [VehicleType.SEDAN]: 120 * R,
      [VehicleType.MPV_STD]: 140 * R,
      [VehicleType.MPV_LUX]: 160 * R,
      [VehicleType.VAN]: 160 * R
    }
  },
  // SG -> Desaru
  // SGD: 130, 160, 180, 180
  {
    from: "Singapore",
    to: "Desaru",
    prices: {
      [VehicleType.SEDAN]: 130 * R,
      [VehicleType.MPV_STD]: 160 * R,
      [VehicleType.MPV_LUX]: 180 * R,
      [VehicleType.VAN]: 180 * R
    }
  },
  // SG -> Kluang / Batu Pahat / Yong Peng
  // SGD: 150, 170, 180, 200
  {
    from: "Singapore",
    to: "Kluang",
    prices: {
      [VehicleType.SEDAN]: 150 * R,
      [VehicleType.MPV_STD]: 170 * R,
      [VehicleType.MPV_LUX]: 180 * R,
      [VehicleType.VAN]: 200 * R
    }
  },
  {
    from: "Singapore",
    to: "Batu Pahat",
    prices: {
      [VehicleType.SEDAN]: 150 * R,
      [VehicleType.MPV_STD]: 170 * R,
      [VehicleType.MPV_LUX]: 180 * R,
      [VehicleType.VAN]: 200 * R
    }
  },
  {
    from: "Singapore",
    to: "Yong Peng",
    prices: {
      [VehicleType.SEDAN]: 150 * R,
      [VehicleType.MPV_STD]: 170 * R,
      [VehicleType.MPV_LUX]: 180 * R,
      [VehicleType.VAN]: 200 * R
    }
  },
  // SG -> Segamat / Mersing / Muar
  // SGD: 180, 200, 220, 250
  {
    from: "Singapore",
    to: "Segamat",
    prices: {
      [VehicleType.SEDAN]: 180 * R,
      [VehicleType.MPV_STD]: 200 * R,
      [VehicleType.MPV_LUX]: 220 * R,
      [VehicleType.VAN]: 250 * R
    }
  },
  {
    from: "Singapore",
    to: "Mersing",
    prices: {
      [VehicleType.SEDAN]: 180 * R,
      [VehicleType.MPV_STD]: 200 * R,
      [VehicleType.MPV_LUX]: 220 * R,
      [VehicleType.VAN]: 250 * R
    }
  },
  {
    from: "Singapore",
    to: "Muar",
    prices: {
      [VehicleType.SEDAN]: 180 * R,
      [VehicleType.MPV_STD]: 200 * R,
      [VehicleType.MPV_LUX]: 220 * R,
      [VehicleType.VAN]: 250 * R
    }
  },
  // SG -> Malacca
  // SGD: 220, 250, 270, 300
  {
    from: "Singapore",
    to: "Malacca",
    prices: {
      [VehicleType.SEDAN]: 220 * R,
      [VehicleType.MPV_STD]: 250 * R,
      [VehicleType.MPV_LUX]: 270 * R,
      [VehicleType.VAN]: 300 * R
    }
  },
  // SG -> Seremban / Kuala Lumpur
  // SGD: 270, 300, 330, 350
  {
    from: "Singapore",
    to: "Seremban",
    prices: {
      [VehicleType.SEDAN]: 270 * R,
      [VehicleType.MPV_STD]: 300 * R,
      [VehicleType.MPV_LUX]: 330 * R,
      [VehicleType.VAN]: 350 * R
    }
  },
  {
    from: "Singapore",
    to: "Kuala Lumpur",
    prices: {
      [VehicleType.SEDAN]: 270 * R,
      [VehicleType.MPV_STD]: 300 * R,
      [VehicleType.MPV_LUX]: 330 * R,
      [VehicleType.VAN]: 350 * R
    }
  },
  // SG -> Genting
  // SGD: 300, 350, 380, 380
  {
    from: "Singapore",
    to: "Genting",
    prices: {
      [VehicleType.SEDAN]: 300 * R,
      [VehicleType.MPV_STD]: 350 * R,
      [VehicleType.MPV_LUX]: 380 * R,
      [VehicleType.VAN]: 380 * R
    }
  },
  // SG -> Cameron
  // SGD: 400, 450, 550, 600
  {
    from: "Singapore",
    to: "Cameron",
    prices: {
      [VehicleType.SEDAN]: 400 * R,
      [VehicleType.MPV_STD]: 450 * R,
      [VehicleType.MPV_LUX]: 550 * R,
      [VehicleType.VAN]: 600 * R
    }
  },
  // SG -> Setiawan / Kampar / Ipoh
  // SGD: 450, 500, 550, 580
  {
    from: "Singapore",
    to: "Setiawan",
    prices: {
      [VehicleType.SEDAN]: 450 * R,
      [VehicleType.MPV_STD]: 500 * R,
      [VehicleType.MPV_LUX]: 550 * R,
      [VehicleType.VAN]: 580 * R
    }
  },
  {
    from: "Singapore",
    to: "Kampar",
    prices: {
      [VehicleType.SEDAN]: 450 * R,
      [VehicleType.MPV_STD]: 500 * R,
      [VehicleType.MPV_LUX]: 550 * R,
      [VehicleType.VAN]: 580 * R
    }
  },
  {
    from: "Singapore",
    to: "Ipoh",
    prices: {
      [VehicleType.SEDAN]: 450 * R,
      [VehicleType.MPV_STD]: 500 * R,
      [VehicleType.MPV_LUX]: 550 * R,
      [VehicleType.VAN]: 580 * R
    }
  },
  // SG -> Penang
  // SGD: 500, 550, 600, 600
  {
    from: "Singapore",
    to: "Penang",
    prices: {
      [VehicleType.SEDAN]: 500 * R,
      [VehicleType.MPV_STD]: 550 * R,
      [VehicleType.MPV_LUX]: 600 * R,
      [VehicleType.VAN]: 600 * R
    }
  },

  // --- FROM KUALA LUMPUR ---
  
  // KL -> KLIA
  {
    from: "City Area", // Matches "Kuala Lumpur - City Area"
    to: "KLIA",
    prices: {
      [VehicleType.SEDAN]: 100,
      [VehicleType.MPV_STD]: 150,
      [VehicleType.MPV_LUX]: 200,
      [VehicleType.VAN]: 250
    }
  },
  // KLIA -> Genting
  {
    from: "KLIA", // Matches "Kuala Lumpur - KLIA 1/2"
    to: "Genting",
    prices: {
      [VehicleType.SEDAN]: 250,
      [VehicleType.MPV_STD]: 300,
      [VehicleType.MPV_LUX]: 400,
      [VehicleType.VAN]: 450
    }
  },
  // KL -> Genting
  {
    from: "City Area",
    to: "Genting",
    prices: {
      [VehicleType.SEDAN]: 150,
      [VehicleType.MPV_STD]: 250,
      [VehicleType.MPV_LUX]: 300,
      [VehicleType.VAN]: 350
    }
  },
  // KL -> Cameron
  {
    from: "City Area",
    to: "Cameron",
    prices: {
      [VehicleType.SEDAN]: 600,
      [VehicleType.MPV_STD]: 750,
      [VehicleType.MPV_LUX]: 900,
      [VehicleType.VAN]: 950
    }
  },
  // KL -> Malacca
  {
    from: "City Area",
    to: "Malacca",
    prices: {
      [VehicleType.SEDAN]: 300,
      [VehicleType.MPV_STD]: 400,
      [VehicleType.MPV_LUX]: 550,
      [VehicleType.VAN]: 600
    }
  },
  // KL -> Penang
  {
    from: "City Area",
    to: "Penang",
    prices: {
      [VehicleType.SEDAN]: 550,
      [VehicleType.MPV_STD]: 650,
      [VehicleType.MPV_LUX]: 850,
      [VehicleType.VAN]: 900
    }
  },
  // KL -> Johor Bahru
  {
    from: "City Area",
    to: "Johor Bahru",
    prices: {
      [VehicleType.SEDAN]: 550,
      [VehicleType.MPV_STD]: 650,
      [VehicleType.MPV_LUX]: 750,
      [VehicleType.VAN]: 800
    }
  },

  // --- FROM JOHOR BAHRU (JB) ---
  
  {
    from: "Johor Bahru",
    to: "Johor Bahru", // JB Local - Moved to Top
    prices: {
      [VehicleType.SEDAN]: 50,
      [VehicleType.MPV_STD]: 80,
      [VehicleType.MPV_LUX]: 120,
      [VehicleType.VAN]: 150
    }
  },
  {
    from: "Johor Bahru",
    to: "Kota Tinggi",
    prices: {
      [VehicleType.SEDAN]: 150,
      [VehicleType.MPV_STD]: 200,
      [VehicleType.MPV_LUX]: 250,
      [VehicleType.VAN]: 300
    }
  },
  {
    from: "Johor Bahru",
    to: "Desaru",
    prices: {
      [VehicleType.SEDAN]: 250,
      [VehicleType.MPV_STD]: 350,
      [VehicleType.MPV_LUX]: 450,
      [VehicleType.VAN]: 500
    }
  },
  {
    from: "Johor Bahru",
    to: "Kluang",
    prices: {
      [VehicleType.SEDAN]: 400,
      [VehicleType.MPV_STD]: 450,
      [VehicleType.MPV_LUX]: 550,
      [VehicleType.VAN]: 600
    }
  },
  {
    from: "Johor Bahru",
    to: "Batu Pahat",
    prices: {
      [VehicleType.SEDAN]: 400,
      [VehicleType.MPV_STD]: 450,
      [VehicleType.MPV_LUX]: 550,
      [VehicleType.VAN]: 600
    }
  },
  {
    from: "Johor Bahru",
    to: "Yong Peng",
    prices: {
      [VehicleType.SEDAN]: 400,
      [VehicleType.MPV_STD]: 450,
      [VehicleType.MPV_LUX]: 550,
      [VehicleType.VAN]: 600
    }
  },
  {
    from: "Johor Bahru",
    to: "Segamat",
    prices: {
      [VehicleType.SEDAN]: 450,
      [VehicleType.MPV_STD]: 500,
      [VehicleType.MPV_LUX]: 600,
      [VehicleType.VAN]: 650
    }
  },
  {
    from: "Johor Bahru",
    to: "Mersing",
    prices: {
      [VehicleType.SEDAN]: 450,
      [VehicleType.MPV_STD]: 500,
      [VehicleType.MPV_LUX]: 600,
      [VehicleType.VAN]: 650
    }
  },
  {
    from: "Johor Bahru",
    to: "Muar",
    prices: {
      [VehicleType.SEDAN]: 450,
      [VehicleType.MPV_STD]: 500,
      [VehicleType.MPV_LUX]: 600,
      [VehicleType.VAN]: 650
    }
  },
  {
    from: "Johor Bahru",
    to: "Malacca",
    prices: {
      [VehicleType.SEDAN]: 500,
      [VehicleType.MPV_STD]: 600,
      [VehicleType.MPV_LUX]: 650,
      [VehicleType.VAN]: 700
    }
  },
  {
    from: "Johor Bahru",
    to: "KLIA",
    prices: {
      [VehicleType.SEDAN]: 550,
      [VehicleType.MPV_STD]: 650,
      [VehicleType.MPV_LUX]: 750,
      [VehicleType.VAN]: 800
    }
  },
  {
    from: "Johor Bahru",
    to: "Seremban",
    prices: {
      [VehicleType.SEDAN]: 600,
      [VehicleType.MPV_STD]: 700,
      [VehicleType.MPV_LUX]: 800,
      [VehicleType.VAN]: 850
    }
  },
  {
    from: "Johor Bahru",
    to: "Kuala Lumpur",
    prices: {
      [VehicleType.SEDAN]: 600,
      [VehicleType.MPV_STD]: 700,
      [VehicleType.MPV_LUX]: 800,
      [VehicleType.VAN]: 850
    }
  },
  {
    from: "Johor Bahru",
    to: "Genting",
    prices: {
      [VehicleType.SEDAN]: 850,
      [VehicleType.MPV_STD]: 950,
      [VehicleType.MPV_LUX]: 1100,
      [VehicleType.VAN]: 1100
    }
  },
  {
    from: "Johor Bahru",
    to: "Cameron",
    prices: {
      [VehicleType.SEDAN]: 1000,
      [VehicleType.MPV_STD]: 1200,
      [VehicleType.MPV_LUX]: 1400,
      [VehicleType.VAN]: 1600
    }
  },
  {
    from: "Johor Bahru",
    to: "Setiawan",
    prices: {
      [VehicleType.SEDAN]: 1100,
      [VehicleType.MPV_STD]: 1300,
      [VehicleType.MPV_LUX]: 1500,
      [VehicleType.VAN]: 1600
    }
  },
  {
    from: "Johor Bahru",
    to: "Kampar",
    prices: {
      [VehicleType.SEDAN]: 1100,
      [VehicleType.MPV_STD]: 1300,
      [VehicleType.MPV_LUX]: 1500,
      [VehicleType.VAN]: 1600
    }
  },
  {
    from: "Johor Bahru",
    to: "Ipoh",
    prices: {
      [VehicleType.SEDAN]: 1100,
      [VehicleType.MPV_STD]: 1300,
      [VehicleType.MPV_LUX]: 1500,
      [VehicleType.VAN]: 1600
    }
  },
  {
    from: "Johor Bahru",
    to: "Penang",
    prices: {
      [VehicleType.SEDAN]: 1200,
      [VehicleType.MPV_STD]: 1400,
      [VehicleType.MPV_LUX]: 1600,
      [VehicleType.VAN]: 1700
    }
  }
];

export const WHATSAPP_NUMBER = "60188706966"; 

export const TESTIMONIALS = [
  { image: "https://i.ibb.co/bM83K10c/1080-x-1080.png" },
  { image: "https://i.ibb.co/23ZVbBhg/1080-x-1080-1.png" },
  { image: "https://i.ibb.co/JjzdjC1n/10.png" },
  { image: "https://i.ibb.co/WWJpgKNt/9.png" },
  { image: "https://i.ibb.co/5xWZkC7R/8.png" },
  { image: "https://i.ibb.co/9kG2Sqxy/11.png" },
  { image: "https://i.ibb.co/b5tnbWQY/12.png" },
  { image: "https://i.ibb.co/rGt1tRjD/13.png" }
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

// --- GOOGLE SHEET INTEGRATION ---
// IMPORTANT: You must deploy your Google Apps Script as a Web App and paste the URL here.
// Example URL: "https://script.google.com/macros/s/AKfycbwEQZns-MtWNpl2LqzlIQCo8Hq-ca6JrhhYHDjJIPkVn4-3FqR2MxlLIvK6uqOT7ro/exec"
export const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwEQZns-MtWNpl2LqzlIQCo8Hq-ca6JrhhYHDjJIPkVn4-3FqR2MxlLIvK6uqOT7ro/exec";
