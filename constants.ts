
import { RoutePrice, VehicleSpecs, VehicleType } from './types.ts';

export const LOCATIONS = [
  "Singapore - Changi Airport",
  "Singapore - City / Hotel",
  "Singapore - Residential",
  "Johor Bahru - City / JB Sentral",
  "Johor Bahru - Senai Airport",
  "Johor Bahru - Legoland",
  "Johor Bahru - Desaru",
  "Johor Bahru - Mersing Jetty",
  "Johor Tour (10 Hour)",
  "Johor Tour (12 Hour)",
  "Local Tour (10 Hour)",
  "Local Tour (12 Hour)",
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
  "Taiping",
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
    maxLuggage: 3, // Updated from 2 to 3
    paxLabel: "Max 4 Passenger",
    description: "Ideal for couples or small families. Comfortable and economical.",
    image: "https://i.ibb.co/MkrMRGHP/4.png",
    interiorImage: "https://i.ibb.co/Z6b5YSLP/22.png"
  },
  {
    type: VehicleType.MPV_STD,
    maxPax: 6,
    maxLuggage: 4, // Mixed
    paxLabel: "Max 6 Passenger",
    description: "Toyota Innova or Perodua Aruz. Great for families with extra luggage space.",
    image: "https://www.bigwheels.my/wp-content/uploads/2021/04/Perodua-Aruz.jpg",
    interiorImage: "https://i.ibb.co/FLhMv7xx/23.png"
  },
  {
    type: VehicleType.MPV_LUX,
    maxPax: 6,
    maxLuggage: 5,
    paxLabel: "Max 6-7 Passenger",
    description: "Toyota Alphard / Vellfire. VIP comfort with pilot seats and premium legroom.",
    image: "https://i.ibb.co/F1r3WqY/5.png",
    interiorImage: "https://i.ibb.co/1fZNHNnC/24.png"
  },
  {
    type: VehicleType.VAN,
    maxPax: 9,
    maxLuggage: 7,
    paxLabel: "Max 9 Passenger",
    description: "Hyundai Starex or similar. Spacious Multi-Purpose Vehicle for larger groups.",
    image: "https://i.ibb.co/TMhrqDFj/Gemini-Generated-Image-ayddmgayddmgaydd.png",
    interiorImage: "https://i.ibb.co/kgGfydGq/RF-Logo-1.png"
  }
];

const R = 3.2; // Rate used to store SGD prices as MYR in matrix, so (Value * 3.2) / 3.2 = Value SGD

export const PRICING_MATRIX: RoutePrice[] = [
  // --- FROM SINGAPORE ---
  
  // SG -> Johor Day Trip (10 Hour)
  {
    from: "Singapore",
    to: "Johor Tour (10 Hour)",
    labelTo: "Johor Tour\n(10 Hour)",
    prices: {
      [VehicleType.SEDAN]: 300 * R,
      [VehicleType.MPV_STD]: 350 * R,
      [VehicleType.MPV_LUX]: 400 * R,
      [VehicleType.VAN]: 450 * R
    }
  },
  // SG -> Johor Day Trip (12 Hour)
  {
    from: "Singapore",
    to: "Johor Tour (12 Hour)",
    labelTo: "Johor Tour\n(12 Hour)",
    prices: {
      [VehicleType.SEDAN]: 350 * R,
      [VehicleType.MPV_STD]: 400 * R,
      [VehicleType.MPV_LUX]: 450 * R,
      [VehicleType.VAN]: 500 * R
    }
  },

  // SG -> JB (Covers City, Senai, Legoland)
  // SGD: 90, 100, 120, 120
  {
    from: "Singapore",
    to: "Johor Bahru - City / JB Sentral",
    labelTo: "Johor Bahru",
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
    to: "Johor Bahru - Desaru",
    labelTo: "Desaru",
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
  // SG -> Mersing
  // SGD: 170, 190, 210, 230
  {
    from: "Singapore",
    to: "Johor Bahru - Mersing Jetty",
    labelTo: "Mersing",
    prices: {
      [VehicleType.SEDAN]: 170 * R,
      [VehicleType.MPV_STD]: 190 * R,
      [VehicleType.MPV_LUX]: 210 * R,
      [VehicleType.VAN]: 230 * R
    }
  },
  // SG -> Muar
  // SGD: 190, 210, 230, 250
  {
    from: "Singapore",
    to: "Muar",
    prices: {
      [VehicleType.SEDAN]: 190 * R,
      [VehicleType.MPV_STD]: 210 * R,
      [VehicleType.MPV_LUX]: 230 * R,
      [VehicleType.VAN]: 250 * R
    }
  },
  // SG -> Segamat
  // SGD: 200, 220, 250, 270
  {
    from: "Singapore",
    to: "Segamat",
    prices: {
      [VehicleType.SEDAN]: 200 * R,
      [VehicleType.MPV_STD]: 220 * R,
      [VehicleType.MPV_LUX]: 250 * R,
      [VehicleType.VAN]: 270 * R
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
    to: "Kuala Lumpur - City Area",
    labelTo: "Kuala Lumpur",
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
    to: "Genting Highlands",
    labelTo: "Genting",
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
    to: "Cameron Highlands",
    labelTo: "Cameron",
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
  // SG -> Taiping
  // SGD: 500, 550, 600, 600
  {
    from: "Singapore",
    to: "Taiping",
    prices: {
      [VehicleType.SEDAN]: 500 * R,
      [VehicleType.MPV_STD]: 550 * R,
      [VehicleType.MPV_LUX]: 600 * R,
      [VehicleType.VAN]: 600 * R
    }
  },
  // SG -> Penang
  // SGD: 550, 600, 650, 650
  {
    from: "Singapore",
    to: "Penang",
    prices: {
      [VehicleType.SEDAN]: 550 * R,
      [VehicleType.MPV_STD]: 600 * R,
      [VehicleType.MPV_LUX]: 650 * R,
      [VehicleType.VAN]: 650 * R
    }
  },

  // --- FROM KUALA LUMPUR ---
  
  // KL City Tour (10 Hour)
  {
    from: "Kuala Lumpur - City Area",
    to: "Local Tour (10 Hour)",
    labelTo: "Local Tour\n(10 Hour)",
    prices: {
      [VehicleType.SEDAN]: 650,
      [VehicleType.MPV_STD]: 800,
      [VehicleType.MPV_LUX]: 1000,
      [VehicleType.VAN]: 1100
    }
  },
  // KL City Tour (12 Hour)
  {
    from: "Kuala Lumpur - City Area",
    to: "Local Tour (12 Hour)",
    labelTo: "Local Tour\n(12 Hour)",
    prices: {
      [VehicleType.SEDAN]: 750,
      [VehicleType.MPV_STD]: 950,
      [VehicleType.MPV_LUX]: 1200,
      [VehicleType.VAN]: 1400
    }
  },

  // KL -> KLIA
  {
    from: "Kuala Lumpur - City Area", 
    to: "Kuala Lumpur - KLIA 1/2",
    labelTo: "KLIA",
    prices: {
      [VehicleType.SEDAN]: 120, 
      [VehicleType.MPV_STD]: 150,
      [VehicleType.MPV_LUX]: 200,
      [VehicleType.VAN]: 250
    }
  },
  // KLIA -> Genting
  {
    from: "Kuala Lumpur - KLIA 1/2", 
    to: "Genting Highlands",
    labelTo: "Genting\n(From KLIA)",
    prices: {
      [VehicleType.SEDAN]: 250,
      [VehicleType.MPV_STD]: 300,
      [VehicleType.MPV_LUX]: 400,
      [VehicleType.VAN]: 450
    }
  },
  // KL -> Genting
  {
    from: "Kuala Lumpur - City Area",
    to: "Genting Highlands",
    labelTo: "Genting\n(From City)",
    prices: {
      [VehicleType.SEDAN]: 150,
      [VehicleType.MPV_STD]: 250,
      [VehicleType.MPV_LUX]: 300,
      [VehicleType.VAN]: 350
    }
  },
  // KL -> Ipoh
  {
    from: "Kuala Lumpur - City Area",
    to: "Ipoh",
    prices: {
      [VehicleType.SEDAN]: 450,
      [VehicleType.MPV_STD]: 550,
      [VehicleType.MPV_LUX]: 650,
      [VehicleType.VAN]: 700
    }
  },
  // KL -> Cameron
  {
    from: "Kuala Lumpur - City Area",
    to: "Cameron Highlands",
    labelTo: "Cameron",
    prices: {
      [VehicleType.SEDAN]: 600,
      [VehicleType.MPV_STD]: 750,
      [VehicleType.MPV_LUX]: 900,
      [VehicleType.VAN]: 950
    }
  },
  // KL -> Malacca
  {
    from: "Kuala Lumpur - City Area",
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
    from: "Kuala Lumpur - City Area",
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
    from: "Kuala Lumpur - City Area",
    to: "Johor Bahru - City / JB Sentral",
    labelTo: "Johor Bahru",
    prices: {
      [VehicleType.SEDAN]: 550,
      [VehicleType.MPV_STD]: 650,
      [VehicleType.MPV_LUX]: 750,
      [VehicleType.VAN]: 800
    }
  },

  // --- FROM JOHOR BAHRU (JB) ---
  
  // JB City Tour (10 Hour)
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Local Tour (10 Hour)",
    labelTo: "Local Tour\n(10 Hour)",
    prices: {
      [VehicleType.SEDAN]: 650,
      [VehicleType.MPV_STD]: 800,
      [VehicleType.MPV_LUX]: 1000,
      [VehicleType.VAN]: 1100
    }
  },
  // JB City Tour (12 Hour)
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Local Tour (12 Hour)",
    labelTo: "Local Tour\n(12 Hour)",
    prices: {
      [VehicleType.SEDAN]: 750,
      [VehicleType.MPV_STD]: 950,
      [VehicleType.MPV_LUX]: 1200,
      [VehicleType.VAN]: 1400
    }
  },

  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Johor Bahru - City / JB Sentral", 
    labelTo: "JB Local",
    prices: {
      [VehicleType.SEDAN]: 50,
      [VehicleType.MPV_STD]: 80,
      [VehicleType.MPV_LUX]: 120,
      [VehicleType.VAN]: 150
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Kota Tinggi",
    prices: {
      [VehicleType.SEDAN]: 150,
      [VehicleType.MPV_STD]: 200,
      [VehicleType.MPV_LUX]: 250,
      [VehicleType.VAN]: 300
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Johor Bahru - Desaru",
    labelTo: "Desaru",
    prices: {
      [VehicleType.SEDAN]: 250,
      [VehicleType.MPV_STD]: 350,
      [VehicleType.MPV_LUX]: 450,
      [VehicleType.VAN]: 500
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Kluang",
    prices: {
      [VehicleType.SEDAN]: 400,
      [VehicleType.MPV_STD]: 450,
      [VehicleType.MPV_LUX]: 550,
      [VehicleType.VAN]: 600
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Batu Pahat",
    prices: {
      [VehicleType.SEDAN]: 400,
      [VehicleType.MPV_STD]: 450,
      [VehicleType.MPV_LUX]: 550,
      [VehicleType.VAN]: 600
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Yong Peng",
    prices: {
      [VehicleType.SEDAN]: 400,
      [VehicleType.MPV_STD]: 450,
      [VehicleType.MPV_LUX]: 550,
      [VehicleType.VAN]: 600
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Segamat",
    prices: {
      [VehicleType.SEDAN]: 450,
      [VehicleType.MPV_STD]: 500,
      [VehicleType.MPV_LUX]: 600,
      [VehicleType.VAN]: 650
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Johor Bahru - Mersing Jetty",
    labelTo: "Mersing",
    prices: {
      [VehicleType.SEDAN]: 450,
      [VehicleType.MPV_STD]: 500,
      [VehicleType.MPV_LUX]: 600,
      [VehicleType.VAN]: 650
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Muar",
    prices: {
      [VehicleType.SEDAN]: 450,
      [VehicleType.MPV_STD]: 500,
      [VehicleType.MPV_LUX]: 600,
      [VehicleType.VAN]: 650
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Malacca",
    prices: {
      [VehicleType.SEDAN]: 500,
      [VehicleType.MPV_STD]: 600,
      [VehicleType.MPV_LUX]: 650,
      [VehicleType.VAN]: 700
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Kuala Lumpur - KLIA 1/2",
    labelTo: "KLIA",
    prices: {
      [VehicleType.SEDAN]: 550,
      [VehicleType.MPV_STD]: 650,
      [VehicleType.MPV_LUX]: 750,
      [VehicleType.VAN]: 800
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Seremban",
    prices: {
      [VehicleType.SEDAN]: 600,
      [VehicleType.MPV_STD]: 700,
      [VehicleType.MPV_LUX]: 800,
      [VehicleType.VAN]: 850
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Kuala Lumpur - City Area",
    labelTo: "Kuala Lumpur",
    prices: {
      [VehicleType.SEDAN]: 600,
      [VehicleType.MPV_STD]: 700,
      [VehicleType.MPV_LUX]: 800,
      [VehicleType.VAN]: 850
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Genting Highlands",
    labelTo: "Genting",
    prices: {
      [VehicleType.SEDAN]: 850,
      [VehicleType.MPV_STD]: 950,
      [VehicleType.MPV_LUX]: 1100,
      [VehicleType.VAN]: 1100
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Cameron Highlands",
    labelTo: "Cameron",
    prices: {
      [VehicleType.SEDAN]: 1000,
      [VehicleType.MPV_STD]: 1200,
      [VehicleType.MPV_LUX]: 1400,
      [VehicleType.VAN]: 1600
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Setiawan",
    prices: {
      [VehicleType.SEDAN]: 1100,
      [VehicleType.MPV_STD]: 1300,
      [VehicleType.MPV_LUX]: 1500,
      [VehicleType.VAN]: 1600
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Kampar",
    prices: {
      [VehicleType.SEDAN]: 1100,
      [VehicleType.MPV_STD]: 1300,
      [VehicleType.MPV_LUX]: 1500,
      [VehicleType.VAN]: 1600
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Ipoh",
    prices: {
      [VehicleType.SEDAN]: 1100,
      [VehicleType.MPV_STD]: 1300,
      [VehicleType.MPV_LUX]: 1500,
      [VehicleType.VAN]: 1600
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Taiping",
    prices: {
      [VehicleType.SEDAN]: 1200,
      [VehicleType.MPV_STD]: 1400,
      [VehicleType.MPV_LUX]: 1600,
      [VehicleType.VAN]: 1700
    }
  },
  {
    from: "Johor Bahru - City / JB Sentral",
    to: "Penang",
    prices: {
      [VehicleType.SEDAN]: 1300,
      [VehicleType.MPV_STD]: 1500,
      [VehicleType.MPV_LUX]: 1700,
      [VehicleType.VAN]: 1800
    }
  }
];

export const WHATSAPP_NUMBER = "60188706966"; 

export const TESTIMONIALS = [
  { image: "https://i.ibb.co/prrpgXF6/Whats-App-Image-2026-01-23-at-4-40-11-PM.jpg" },
  { image: "https://i.ibb.co/rGHhm1PV/Whats-App-Image-2026-01-23-at-4-40-10-PM-1.jpg" },
  { image: "https://i.ibb.co/wNvwBpg2/Whats-App-Image-2026-01-23-at-4-40-10-PM.jpg" },
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
    q: "Can the itinerary be adjusted or extended during the trip?",
    a: "Yes. As long as it does not affect the overall schedule or driving safety, the itinerary can be adjusted or extended when needed. We always do our best to accommodate your requests, so your journey stays flexible, comfortable, and unhurried."
  },
  {
    q: "How do I pay?",
    a: "We accept PayNow, Bank Transfer, or Cash to Driver (in RM or SGD) upon arrival at your destination. A small deposit may be required for peak season bookings."
  }
];

// --- GOOGLE SHEET INTEGRATION ---
export const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUyG50MQLr4VQTHJzvBMmUGHrjsruHDXVHa0-NQaQLU2TJA1RLrIhxbQw3SSWsxSdQ/exec";
