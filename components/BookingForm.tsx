

import React, { useState, useEffect, useMemo } from 'react';
import { BookingState, VehicleType } from '../types';
import { LOCATIONS, VEHICLES, PRICING_MATRIX, WHATSAPP_NUMBER, SURCHARGE_CONFIG, PEAK_DATES } from '../constants';
import { MapPin, Calendar, Clock, Users, Briefcase, CheckCircle, ChevronRight, ChevronLeft, ArrowRight, User, Phone, Edit3, ShoppingBag, Backpack, Baby, Zap, MessageCircle } from 'lucide-react';

const EXCHANGE_RATE = 3.2;

const INITIAL_STATE: BookingState = {
  step: 1,
  fromLocation: '',
  toLocation: '',
  date: '',
  time: '09:00',
  tripType: 'one-way',
  paxAdults: 2,
  paxChildren: 0,
  luggageLarge: 1,
  luggageMedium: 1,
  luggageSmall: 0,
  luggageHandCarry: 1,
  selectedVehicle: null,
  name: '',
  phone: '',
  notes: ''
};

interface PriceDetail {
  price: number;
  currency: 'SGD' | 'RM';
  tags: string[]; // 'Peak'
  isQuoteRequired: boolean;
}

export const BookingForm: React.FC<{ prefillRoute?: { from: string, to: string } }> = ({ prefillRoute }) => {
  const [state, setState] = useState<BookingState>(INITIAL_STATE);

  useEffect(() => {
    if (prefillRoute) {
      setState(prev => ({
        ...prev,
        fromLocation: prefillRoute.from,
        toLocation: prefillRoute.to,
        step: 1 // ensure we are on step 1
      }));
    }
  }, [prefillRoute]);

  // Auto-fill return locations when trip type changes to round-trip or when main locations change
  useEffect(() => {
    if (state.tripType === 'round-trip') {
        if (!state.returnFromLocation && state.toLocation) {
            updateState('returnFromLocation', state.toLocation);
        }
        if (!state.returnToLocation && state.fromLocation) {
            updateState('returnToLocation', state.fromLocation);
        }
    }
  }, [state.tripType, state.fromLocation, state.toLocation]);

  const updateState = (key: keyof BookingState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => updateState('step', state.step + 1);
  const prevStep = () => updateState('step', state.step - 1);

  // --- Date Helpers ---
  const checkIsPeak = (dateStr: string) => {
    return PEAK_DATES.includes(dateStr);
  };

  // --- Pricing Logic Helper ---
  
  const getLegPrice = (fromLoc: string, toLoc: string, date: string, time: string, vehicleType: VehicleType): PriceDetail => {
    if (!fromLoc || !toLoc) return { price: 0, currency: 'RM', tags: [], isQuoteRequired: false };

    const from = fromLoc.toLowerCase();
    const to = toLoc.toLowerCase();
    
    // Currency Rule
    // Check if trip involves Singapore (Departing from OR Going to)
    const isSgd = from.includes('singapore') || to.includes('singapore');
    const currency = isSgd ? 'SGD' : 'RM';

    // Find Base Price
    let route = PRICING_MATRIX.find(r => 
      from.includes(r.from.toLowerCase()) && to.includes(r.to.toLowerCase())
    );

    if (!route) {
        route = PRICING_MATRIX.find(r => 
            to.includes(r.from.toLowerCase()) && from.includes(r.to.toLowerCase())
        );
    }

    if (!route) {
        const isSgJb = (from.includes('singapore') && to.includes('johor')) || (from.includes('johor') && to.includes('singapore'));
        if (isSgJb) {
             route = PRICING_MATRIX.find(r => r.from === "Singapore" && r.to === "Johor Bahru");
        }
    }

    let basePrice = 0;
    if (route && route.prices[vehicleType]) {
      basePrice = route.prices[vehicleType] || 0;
    }

    if (basePrice === 0) {
      return { price: 0, currency, tags: [], isQuoteRequired: true };
    }

    // Apply Factors
    const tags: string[] = [];
    let finalPrice = basePrice;
    
    const isPeak = checkIsPeak(date);

    // QUOTE REQUIRED CONDITION:
    // If it's a Long Distance Trip (Genting/Malacca/KL) AND it is Peak Season, force Quote Required due to high variability.
    const isLongDist = to.includes('genting') || to.includes('malacca') || to.includes('kuala lumpur') || from.includes('genting') || from.includes('malacca') || from.includes('kuala lumpur');
    if (isPeak && isLongDist) {
        return { price: 0, currency, tags: ['Peak Season Demand'], isQuoteRequired: true };
    }

    if (isPeak) {
        finalPrice *= SURCHARGE_CONFIG.PEAK_MULTIPLIER;
        tags.push('Peak Season');
    }

    let priceInCurrency = isSgd ? Math.ceil(finalPrice / EXCHANGE_RATE) : finalPrice;

    return { 
        price: Math.ceil(priceInCurrency), 
        currency, 
        tags, 
        isQuoteRequired: false 
    };
  };

  const calculateTotal = (vehicleType: VehicleType) => {
    const outbound = getLegPrice(state.fromLocation, state.toLocation, state.date, state.time, vehicleType);
    
    if (outbound.isQuoteRequired) {
        return { display: 'Quote Required', isQuote: true, tags: outbound.tags };
    }

    let displayStr = '';
    let allTags = [...outbound.tags];

    if (state.tripType === 'one-way') {
      displayStr = `${outbound.currency} ${outbound.price}`;
    } else if (state.tripType === 'round-trip') {
      // Round Trip
      const returnFrom = state.returnFromLocation || state.toLocation;
      const returnTo = state.returnToLocation || state.fromLocation;
      const returnDate = state.returnDate || state.date;
      const returnTime = state.returnTime || '12:00';
      
      const inbound = getLegPrice(returnFrom, returnTo, returnDate, returnTime, vehicleType);

      if (inbound.isQuoteRequired) {
          return { display: 'Quote Required', isQuote: true, tags: [...allTags, ...inbound.tags] };
      }

      allTags = [...new Set([...allTags, ...inbound.tags])];

      if (outbound.currency === inbound.currency) {
        displayStr = `${outbound.currency} ${outbound.price + inbound.price}`;
      } else {
        displayStr = `${outbound.currency} ${outbound.price} + ${inbound.currency} ${inbound.price}`;
      }
    } else {
      // Custom / Multi-Stop
      return { display: 'Custom Quote', isQuote: true, tags: [] };
    }

    return { display: displayStr, isQuote: false, tags: allTags };
  };

  const availableVehicles = useMemo(() => {
    // Luggage Unit Calculation
    const luggageScore = 
      (state.luggageLarge * 1.5) + 
      (state.luggageMedium * 1.0) +
      (state.luggageSmall * 0.5) +
      (state.luggageHandCarry * 0.2);
    
    const totalPax = state.paxAdults + state.paxChildren;

    return VEHICLES.map(v => {
      const maxCapacityUnits = v.maxLuggage * 1.5;
      const isCapacityOk = totalPax <= v.maxPax && luggageScore <= maxCapacityUnits; 
      const priceInfo = calculateTotal(v.type);

      return { ...v, isCapacityOk, priceInfo };
    });
  }, [state]);

  const handleWhatsAppClick = () => {
    const priceInfo = calculateTotal(state.selectedVehicle!);
    const priceDisplay = priceInfo.isQuote ? "Quote Required" : priceInfo.display;

    const returnDetails = state.tripType === 'round-trip' 
        ? `\n*Return Trip:*\n*From:* ${state.returnFromLocation}\n*To:* ${state.returnToLocation}\n*Date:* ${state.returnDate} @ ${state.returnTime}`
        : '';

    const luggageSummary = [
      state.luggageLarge > 0 ? `${state.luggageLarge} Large (28")` : '',
      state.luggageMedium > 0 ? `${state.luggageMedium} Med (24")` : '',
      state.luggageSmall > 0 ? `${state.luggageSmall} Small (20")` : '',
      state.luggageHandCarry > 0 ? `${state.luggageHandCarry} Hand Carry` : ''
    ].filter(Boolean).join(', ') || 'None';

    const msg = `
*New Booking Enquiry*
-------------------
*Trip Type:* ${state.tripType === 'round-trip' ? 'Round Trip' : 'One Way'}

*Outbound Trip:*
*From:* ${state.fromLocation} 
*To:* ${state.toLocation}
*Date:* ${state.date} @ ${state.time}
${returnDetails}

*Vehicle:* ${state.selectedVehicle}
*Pax:* ${state.paxAdults} Adults, ${state.paxChildren} Children
*Luggage:* ${luggageSummary}

*Est. Price:* ${priceDisplay}
${priceInfo.tags.length > 0 ? `*Notes:* Includes ${priceInfo.tags.join(', ')}` : ''}
-------------------
*Name:* ${state.name}
*Notes:* ${state.notes || 'None'}
    `.trim();

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCustomQuoteClick = () => {
    const msg = `
*Custom / Multi-Trip Enquiry*
-------------------
Hi, I have a multi-stop or complex itinerary (more than 2 trips).

*Rough Details:*
*Start Location:* ${state.fromLocation || 'Not specified'}
*Date:* ${state.date || 'Not specified'}

Please assist with a quote.
    `.trim();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // --- Render Steps ---

  // Step 1: Route & Date
  const renderStep1 = () => (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Where are you going?</h3>
      
      {/* Outbound */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pick Up</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select 
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={state.fromLocation}
              onChange={(e) => updateState('fromLocation', e.target.value)}
            >
              <option value="">Select Origin</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Drop Off</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select 
               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
               value={state.toLocation}
               onChange={(e) => updateState('toLocation', e.target.value)}
            >
              <option value="">Select Destination</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Date Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="date" 
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={state.date}
              onChange={(e) => updateState('date', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="time" 
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={state.time}
              onChange={(e) => updateState('time', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 my-4 pb-2 border-b border-gray-100">
         <label className="flex items-center gap-2 cursor-pointer">
           <input type="radio" checked={state.tripType === 'one-way'} onChange={() => updateState('tripType', 'one-way')} className="text-primary-600 focus:ring-primary-500"/>
           <span className="font-medium text-gray-700">One Way</span>
         </label>
         <label className="flex items-center gap-2 cursor-pointer">
           <input type="radio" checked={state.tripType === 'round-trip'} onChange={() => updateState('tripType', 'round-trip')} className="text-primary-600 focus:ring-primary-500"/>
           <span className="font-medium text-gray-700">Round Trip</span>
         </label>
         <label className="flex items-center gap-2 cursor-pointer">
           <input type="radio" checked={state.tripType === 'custom'} onChange={() => updateState('tripType', 'custom')} className="text-primary-600 focus:ring-primary-500"/>
           <span className="font-medium text-gray-700">Multi-Stop ({'>'}2 Trips)</span>
         </label>
      </div>

      {state.tripType === 'round-trip' && (
        <div className="space-y-4 bg-primary-50 p-4 rounded-xl border border-primary-100 animate-fadeIn">
          <div className="text-sm font-bold text-primary-800 mb-1 flex items-center gap-2">
            <CheckCircle size={16}/> Return Trip Details
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Pick Up</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select 
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={state.returnFromLocation || ''}
                  onChange={(e) => updateState('returnFromLocation', e.target.value)}
                >
                  <option value="">Select Return Origin</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Drop Off</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select 
                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                   value={state.returnToLocation || ''}
                   onChange={(e) => updateState('returnToLocation', e.target.value)}
                >
                  <option value="">Select Return Dest.</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={state.returnDate || ''}
                onChange={(e) => updateState('returnDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Time</label>
              <input 
                type="time" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={state.returnTime || ''}
                onChange={(e) => updateState('returnTime', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {state.tripType === 'custom' ? (
         <div className="mt-8 bg-blue-50 p-6 rounded-xl text-center border border-blue-100 animate-fadeIn">
            <div className="inline-flex bg-blue-100 p-3 rounded-full text-blue-600 mb-3">
              <MessageCircle size={28} />
            </div>
            <h4 className="font-bold text-blue-900 mb-2 text-lg">Multiple Stops / Custom Itinerary?</h4>
            <p className="text-blue-800 mb-6 text-sm max-w-sm mx-auto">
              For itineraries with more than 2 trips or specific requirements, please contact us directly for a personalized package.
            </p>
            <button 
              onClick={handleCustomQuoteClick}
              className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-3 rounded-full font-bold hover:bg-[#128C7E] shadow-lg flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105"
            >
              Click here to Get Quote
              <ArrowRight size={18} />
            </button>
         </div>
      ) : (
        <div className="pt-4 flex justify-end">
          <button 
            onClick={nextStep}
            disabled={!state.fromLocation || !state.toLocation || !state.date}
            className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all"
          >
            Next Step <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );

  // Step 2: Pax & Luggage
  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800">Passengers & Luggage</h3>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 mb-4">
        We help you choose the right car based on your group size.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2">
            <Users size={16} /> Adults
          </label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('paxAdults', Math.max(1, state.paxAdults - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-12 text-center">{state.paxAdults}</span>
             <button onClick={() => updateState('paxAdults', Math.min(16, state.paxAdults + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2">
            <Baby size={16} /> Children
          </label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('paxChildren', Math.max(0, state.paxChildren - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-12 text-center">{state.paxChildren}</span>
             <button onClick={() => updateState('paxChildren', Math.min(10, state.paxChildren + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 my-4"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
        {/* Large Luggage */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2">
            <Briefcase size={16} /> Large Luggage (28"+)
          </label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('luggageLarge', Math.max(0, state.luggageLarge - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-8 text-center">{state.luggageLarge}</span>
             <button onClick={() => updateState('luggageLarge', Math.min(10, state.luggageLarge + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>

        {/* Medium Luggage */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2">
            <ShoppingBag size={16} /> Medium Luggage (24")
          </label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('luggageMedium', Math.max(0, state.luggageMedium - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-8 text-center">{state.luggageMedium}</span>
             <button onClick={() => updateState('luggageMedium', Math.min(10, state.luggageMedium + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>

        {/* Small Luggage */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2">
            <Briefcase size={16} className="scale-75" /> Small Luggage (20")
          </label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('luggageSmall', Math.max(0, state.luggageSmall - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-8 text-center">{state.luggageSmall}</span>
             <button onClick={() => updateState('luggageSmall', Math.min(10, state.luggageSmall + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>

        {/* Hand Carry */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2">
            <Backpack size={16} /> Hand Carry Bag
          </label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('luggageHandCarry', Math.max(0, state.luggageHandCarry - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-8 text-center">{state.luggageHandCarry}</span>
             <button onClick={() => updateState('luggageHandCarry', Math.min(10, state.luggageHandCarry + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <button onClick={prevStep} className="text-gray-600 font-medium hover:text-gray-900 flex items-center"><ChevronLeft size={18} /> Back</button>
        <button 
          onClick={nextStep}
          className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 flex items-center transition-all"
        >
          See Vehicles <ChevronRight size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );

  // Step 3: Vehicle Selection
  const renderStep3 = () => {
    const totalPax = state.paxAdults + state.paxChildren;
    
    return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Select your Ride</h3>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {availableVehicles.map((vehicle) => (
          <div 
            key={vehicle.type}
            onClick={() => vehicle.isCapacityOk && updateState('selectedVehicle', vehicle.type)}
            className={`
              relative flex flex-col sm:flex-row items-center p-4 rounded-xl border-2 transition-all cursor-pointer
              ${state.selectedVehicle === vehicle.type ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-primary-200'}
              ${!vehicle.isCapacityOk ? 'opacity-60 grayscale cursor-not-allowed bg-gray-50' : ''}
            `}
          >
            <div className="w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden mb-3 sm:mb-0">
               <img src={vehicle.image} alt={vehicle.type} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 px-4 text-center sm:text-left">
              <h4 className="font-bold text-gray-900">{vehicle.type}</h4>
              <p className="text-xs text-gray-500 mb-2">{vehicle.description}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-gray-600">
                <span className={`flex items-center gap-1 ${totalPax > vehicle.maxPax ? 'text-red-500 font-bold' : ''}`}><Users size={12}/> Max {vehicle.maxPax}</span>
                <span className="flex items-center gap-1"><Briefcase size={12}/> Max {vehicle.maxLuggage} Large bags</span>
              </div>
              {!vehicle.isCapacityOk && (
                 <p className="text-red-500 text-xs font-semibold mt-1">
                    {totalPax > vehicle.maxPax ? 'Too many passengers' : 'Luggage capacity exceeded'}
                 </p>
              )}
            </div>

            <div className="text-right mt-2 sm:mt-0 flex flex-col items-end">
               <div className={`font-bold text-lg ${vehicle.priceInfo.isQuote ? 'text-gray-800' : 'text-primary-700'}`}>
                 {vehicle.priceInfo.display}
               </div>
               
               {/* Badges for Surcharges */}
               {vehicle.priceInfo.tags.length > 0 && (
                   <div className="flex flex-wrap gap-1 justify-end mt-1 max-w-[150px]">
                       {vehicle.priceInfo.tags.includes('Peak Season') && (
                           <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full flex items-center gap-1 font-semibold whitespace-nowrap">
                               <Zap size={10} /> Peak
                           </span>
                       )}
                   </div>
               )}
            </div>
            
            {state.selectedVehicle === vehicle.type && (
                <div className="absolute top-2 right-2 text-primary-600">
                    <CheckCircle size={20} fill="currentColor" className="text-white" />
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-between items-center">
        <button onClick={prevStep} className="text-gray-600 font-medium hover:text-gray-900 flex items-center"><ChevronLeft size={18} /> Back</button>
        <button 
          onClick={nextStep}
          disabled={!state.selectedVehicle}
          className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center transition-all"
        >
          Confirm <ChevronRight size={18} className="ml-1" />
        </button>
      </div>
    </div>
  )};

  // Step 4: Summary & Contact
  const renderStep4 = () => {
      const priceInfo = calculateTotal(state.selectedVehicle!);

      return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Final Details</h3>

      <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-200">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="text-sm text-gray-500">Route (Outbound)</div>
                <div className="font-medium">{state.fromLocation} <br/><span className="text-gray-400 text-xs">to</span><br/> {state.toLocation}</div>
                {state.tripType === 'round-trip' && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                     <div className="text-sm text-gray-500">Route (Return)</div>
                     <div className="font-medium">{state.returnFromLocation} <br/><span className="text-gray-400 text-xs">to</span><br/> {state.returnToLocation}</div>
                  </div>
                )}
            </div>
            <div className="text-right">
                <div className="text-sm text-gray-500">Estimated Total</div>
                <div className="font-bold text-xl text-primary-700 whitespace-pre-wrap max-w-[150px] text-right ml-auto">
                    {priceInfo.display}
                </div>
                {priceInfo.tags.length > 0 && (
                  <div className="text-xs text-orange-600 mt-1">
                      Includes: {priceInfo.tags.join(', ')}
                  </div>
                )}
            </div>
        </div>
        <div className="pt-2 border-t border-gray-200 flex justify-between text-sm">
            <span>Vehicle: <span className="font-medium">{state.selectedVehicle}</span></span>
            <span>Date: <span className="font-medium">{state.date}</span></span>
        </div>
        <div className="text-xs text-gray-500 pt-1">
            * Includes: Driver, Fuel, Tolls. Excludes: Parking, waiting time {'>'} 30mins.
        </div>
      </div>

      <div className="space-y-3">
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    value={state.name}
                    onChange={(e) => updateState('name', e.target.value)}
                />
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Phone</label>
             <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                    type="tel" 
                    placeholder="e.g. +65 9123 4567"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    value={state.phone}
                    onChange={(e) => updateState('phone', e.target.value)}
                />
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
            <div className="relative">
                <Edit3 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea 
                    placeholder="E.g. Elderly passenger, need stops, etc."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-20"
                    value={state.notes}
                    onChange={(e) => updateState('notes', e.target.value)}
                />
            </div>
         </div>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <button 
          onClick={handleWhatsAppClick}
          disabled={!state.name || !state.phone}
          className="w-full bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all"
        >
           <span>{priceInfo.isQuote ? 'Request Custom Quote' : 'Book via WhatsApp Now'}</span>
           <ArrowRight size={20} />
        </button>
        <button onClick={prevStep} className="text-gray-500 text-sm text-center hover:underline">Edit Details</button>
      </div>
    </div>
  )};

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg mx-auto relative overflow-hidden">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8 relative">
         <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10"></div>
         {[1, 2, 3, 4].map(s => (
             <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${state.step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                 {s}
             </div>
         ))}
      </div>

      {state.step === 1 && renderStep1()}
      {state.step === 2 && renderStep2()}
      {state.step === 3 && renderStep3()}
      {state.step === 4 && renderStep4()}
    </div>
  );
};