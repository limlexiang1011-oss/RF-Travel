
export enum VehicleType {
  SEDAN = 'Sedan (4 Pax)',
  MPV_STD = 'Standard MPV (7 Pax)',
  MPV_LUX = 'Luxury MPV (Alphard)',
  VAN = 'Large Multi MPV (9 Pax)'
}

export interface RoutePrice {
  from: string;
  to: string;
  prices: {
    [key in VehicleType]?: number;
  };
}

export interface VehicleSpecs {
  type: VehicleType;
  maxPax: number;
  maxLuggage: number; // calculated as mixed units roughly
  description: string;
  image: string;
}

export interface BookingState {
  step: number;
  fromLocation: string;
  toLocation: string;
  date: string;
  time: string;
  tripType: 'one-way' | 'round-trip' | 'custom';
  returnDate?: string;
  returnTime?: string;
  returnFromLocation?: string;
  returnToLocation?: string;
  paxAdults: number;
  paxChildren: number;
  luggageLarge: number;     // 28"+
  luggageMedium: number;    // 24"
  luggageSmall: number;     // 20"
  luggageHandCarry: number; // Backpacks/Handbags
  selectedVehicle: VehicleType | null;
  name: string;
  phone: string;
  notes: string;
}
