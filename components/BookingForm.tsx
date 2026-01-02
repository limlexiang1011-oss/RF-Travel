
import React, { useState, useEffect, useMemo } from 'react';
import { BookingState, VehicleType, Language } from '../types';
import { LOCATIONS, VEHICLES, PRICING_MATRIX, WHATSAPP_NUMBER, SURCHARGE_CONFIG, PEAK_DATES, GOOGLE_SHEET_SCRIPT_URL } from '../constants';
import { MapPin, Calendar, Clock, Users, Briefcase, CheckCircle, ChevronRight, ChevronLeft, ArrowRight, User, Phone, Edit3, ShoppingBag, Backpack, Baby, Zap, MessageCircle, ChevronDown } from 'lucide-react';
import { translations } from '../translations';

const EXCHANGE_RATE = 3.2;

const INITIAL_STATE: BookingState = {
  step: 1,
  fromLocation: '',
  toLocation: '',
  date: '',
  time: '09:00',
  tripType: 'one-way',
  dayTripDuration: 10,
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
  tags: string[];
  isQuoteRequired: boolean;
}

export const BookingForm: React.FC<{ prefillRoute?: { from: string, to: string }, lang: Language }> = ({ prefillRoute, lang }) => {
  const [state, setState] = useState<BookingState>(INITIAL_STATE);
  const t = translations[lang].booking;

  useEffect(() => {
    if (prefillRoute) {
      setState(prev => ({
        ...prev,
        fromLocation: prefillRoute.from,
        toLocation: prefillRoute.to,
        step: 1
      }));
    }
  }, [prefillRoute]);

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

  const checkIsPeak = (dateStr: string) => {
    return PEAK_DATES.includes(dateStr);
  };

  const getLegPrice = (fromLoc: string, toLoc: string, date: string, time: string, vehicleType: VehicleType): PriceDetail => {
    if (!fromLoc || !toLoc) return { price: 0, currency: 'RM', tags: [], isQuoteRequired: false };

    const from = fromLoc.toLowerCase();
    const to = toLoc.toLowerCase();
    const isSgd = from.includes('singapore') || to.includes('singapore');
    const currency = isSgd ? 'SGD' : 'RM';

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

    const tags: string[] = [];
    let finalPrice = basePrice;
    const isPeak = checkIsPeak(date);

    const isLongDist = to.includes('genting') || to.includes('malacca') || to.includes('kuala lumpur') || from.includes('genting') || from.includes('malacca') || from.includes('kuala lumpur');
    if (isPeak && isLongDist) {
        return { price: 0, currency, tags: [lang === 'en' ? 'Peak Season Demand' : '高峰期需求'], isQuoteRequired: true };
    }

    if (isPeak) {
        finalPrice *= SURCHARGE_CONFIG.PEAK_MULTIPLIER;
        tags.push(lang === 'en' ? 'Peak Season' : '高峰期');
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
    if (state.tripType === 'day-trip') {
       const label = lang === 'en' ? `Day Trip (${state.dayTripDuration} Hours)` : `包车一日游 (${state.dayTripDuration}小时)`;
       const quoteLabel = lang === 'en' ? 'Contact for Quote' : '联系报价';
       return { display: quoteLabel, isQuote: true, tags: [label] };
    }

    const outbound = getLegPrice(state.fromLocation, state.toLocation, state.date, state.time, vehicleType);
    const quoteLabel = lang === 'en' ? 'Quote Required' : '需咨询报价';
    if (outbound.isQuoteRequired) {
        return { display: quoteLabel, isQuote: true, tags: outbound.tags };
    }

    let displayStr = '';
    let allTags = [...outbound.tags];

    if (state.tripType === 'one-way') {
      displayStr = `${outbound.currency} ${outbound.price}`;
    } else if (state.tripType === 'round-trip') {
      const returnFrom = state.returnFromLocation || state.toLocation;
      const returnTo = state.returnToLocation || state.fromLocation;
      const returnDate = state.returnDate || state.date;
      const returnTime = state.returnTime || '12:00';
      const inbound = getLegPrice(returnFrom, returnTo, returnDate, returnTime, vehicleType);
      if (inbound.isQuoteRequired) {
          return { display: quoteLabel, isQuote: true, tags: [...allTags, ...inbound.tags] };
      }
      allTags = [...new Set([...allTags, ...inbound.tags])];
      if (outbound.currency === inbound.currency) {
        displayStr = `${outbound.currency} ${outbound.price + inbound.price}`;
      } else {
        displayStr = `${outbound.currency} ${outbound.price} + ${inbound.currency} ${inbound.price}`;
      }
    } else {
      return { display: lang === 'en' ? 'Custom Quote' : '定制报价', isQuote: true, tags: [] };
    }

    return { display: displayStr, isQuote: false, tags: allTags };
  };

  const availableVehicles = useMemo(() => {
    const luggageScore = (state.luggageLarge * 1.5) + (state.luggageMedium * 1.0) + (state.luggageSmall * 0.5) + (state.luggageHandCarry * 0.2);
    const totalPax = state.paxAdults + state.paxChildren;
    return VEHICLES.map(v => {
      const maxCapacityUnits = v.maxLuggage * 1.5;
      const isCapacityOk = totalPax <= v.maxPax && luggageScore <= maxCapacityUnits; 
      const priceInfo = calculateTotal(v.type);
      return { ...v, isCapacityOk, priceInfo };
    });
  }, [state, lang]);

  const handleWhatsAppClick = () => {
    const priceInfo = calculateTotal(state.selectedVehicle!);
    const priceDisplay = priceInfo.isQuote ? "Quote Required" : priceInfo.display;

    // Track Ads & Pixel Conversion
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', { 'send_to': 'AW-17810501351/ic3rCKj_w9QbEOfd2qxC' });
    }
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Contact');
    }

    const returnDetails = state.tripType === 'round-trip' 
        ? `\n*Return Trip:* ${state.returnFromLocation} to ${state.returnToLocation} on ${state.returnDate} @ ${state.returnTime}`
        : '';
    let tripTypeDisplay = lang === 'en' ? 'One Way' : '单程';
    if (state.tripType === 'round-trip') tripTypeDisplay = lang === 'en' ? 'Round Trip' : '往返';
    if (state.tripType === 'day-trip') tripTypeDisplay = lang === 'en' ? `Day Trip (${state.dayTripDuration} Hours)` : `一日游 (${state.dayTripDuration}小时)`;

    const totalPax = state.paxAdults + state.paxChildren;
    const luggageSummary = [
      state.luggageLarge > 0 ? `${state.luggageLarge} Large` : '',
      state.luggageMedium > 0 ? `${state.luggageMedium} Med` : '',
      state.luggageSmall > 0 ? `${state.luggageSmall} Small` : '',
      state.luggageHandCarry > 0 ? `${state.luggageHandCarry} Hand` : ''
    ].filter(Boolean).join(', ') || 'None';

    const msg = `
Hi, I’m interested in your Charter Car Service form Website. 我想咨询关于包车服务的有关详情

*Trip:* ${state.fromLocation} to ${state.toLocation}
*Date:* ${state.date} @ ${state.time}
*Type:* ${tripTypeDisplay}${returnDetails}
*Pax:* ${totalPax} (${state.paxAdults}A, ${state.paxChildren}C)
*Vehicle:* ${state.selectedVehicle}
*Luggage:* ${luggageSummary}
*Est. Price:* ${priceDisplay}
${priceInfo.tags.length > 0 ? `*Note:* ${priceInfo.tags.join(', ')}` : ''}
*Name:* ${state.name}
*Phone:* ${state.phone}
*Notes:* ${state.notes || 'None'}
    `.trim();

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCustomQuoteClick = () => {
    const totalPax = state.paxAdults + state.paxChildren;
    const msg = `
Hi, I’m interested in your Charter Car Service form Website. 我想咨询关于包车服务的有关详情

*Pickup:* ${state.fromLocation || 'TBD'}
*Destination:* ${state.toLocation || 'TBD'}
*Date:* ${state.date || 'TBD'}
*Pax:* ${totalPax || 'TBD'}

I have a multi-stop or complex itinerary. Please provide a tailored quote.
    `.trim();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const inputBaseClass = "w-full h-12 pl-10 pr-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-base transition-all";
  const selectClass = `${inputBaseClass} appearance-none pr-10`; 

  const renderStep1 = () => (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{t.title1}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.pickup}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <select className={selectClass} value={state.fromLocation} onChange={(e) => updateState('fromLocation', e.target.value)}>
              <option value="">{lang === 'en' ? 'Select Origin' : '选择出发地点'}</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.dest}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <select className={selectClass} value={state.toLocation} onChange={(e) => updateState('toLocation', e.target.value)}>
              <option value="">{lang === 'en' ? 'Select Destination' : '选择目的地'}</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.date}</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <input type="date" className={`${inputBaseClass} appearance-none`} value={state.date} onChange={(e) => updateState('date', e.target.value)}/>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.time}</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <input type="time" className={`${inputBaseClass} appearance-none`} value={state.time} onChange={(e) => updateState('time', e.target.value)}/>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 my-4 pb-2 border-b border-gray-100">
         <label className="flex items-center gap-2 cursor-pointer">
           <input type="radio" checked={state.tripType === 'one-way'} onChange={() => updateState('tripType', 'one-way')} className="text-primary-600 focus:ring-primary-500 w-5 h-5"/>
           <span className="font-medium text-gray-700">{t.oneWay}</span>
         </label>
         <label className="flex items-center gap-2 cursor-pointer">
           <input type="radio" checked={state.tripType === 'round-trip'} onChange={() => updateState('tripType', 'round-trip')} className="text-primary-600 focus:ring-primary-500 w-5 h-5"/>
           <span className="font-medium text-gray-700">{t.roundTrip}</span>
         </label>
         <label className="flex items-center gap-2 cursor-pointer">
           <input type="radio" checked={state.tripType === 'day-trip'} onChange={() => updateState('tripType', 'day-trip')} className="text-primary-600 focus:ring-primary-500 w-5 h-5"/>
           <span className="font-medium text-gray-700">{t.dayTrip}</span>
         </label>
         <label className="flex items-center gap-2 cursor-pointer">
           <input type="radio" checked={state.tripType === 'custom'} onChange={() => updateState('tripType', 'custom')} className="text-primary-600 focus:ring-primary-500 w-5 h-5"/>
           <span className="font-medium text-gray-700">{t.multiStop}</span>
         </label>
      </div>
      {state.tripType === 'day-trip' && (
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 animate-fadeIn mb-4">
            <div className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2"><Clock size={16}/> {t.duration}</div>
            <div className="flex gap-4">
                <button onClick={() => updateState('dayTripDuration', 10)} className={`flex-1 py-3 rounded-lg border font-semibold transition-all ${state.dayTripDuration === 10 ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>10 {t.hours}</button>
                <button onClick={() => updateState('dayTripDuration', 12)} className={`flex-1 py-3 rounded-lg border font-semibold transition-all ${state.dayTripDuration === 12 ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>12 {t.hours}</button>
            </div>
            <p className="text-xs text-orange-700 mt-2">{t.privateNote}</p>
        </div>
      )}
      {state.tripType === 'round-trip' && (
        <div className="space-y-4 bg-primary-50 p-4 rounded-xl border border-primary-100 animate-fadeIn">
          <div className="text-sm font-bold text-primary-800 mb-1 flex items-center gap-2"><CheckCircle size={16}/> {lang === 'en' ? 'Return Trip Details' : '回程详情'}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.returnPickup}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                <select className={selectClass} value={state.returnFromLocation || ''} onChange={(e) => updateState('returnFromLocation', e.target.value)}>
                  <option value="">{lang === 'en' ? 'Select Return Origin' : '选择回程出发点'}</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.returnDest}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                <select className={selectClass} value={state.returnToLocation || ''} onChange={(e) => updateState('returnToLocation', e.target.value)}>
                  <option value="">{lang === 'en' ? 'Select Return Dest.' : '选择回程目的地'}</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.returnDate}</label>
              <input type="date" className={`${inputBaseClass} appearance-none`} value={state.returnDate || ''} onChange={(e) => updateState('returnDate', e.target.value)}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.returnTime}</label>
              <input type="time" className={`${inputBaseClass} appearance-none`} value={state.returnTime || ''} onChange={(e) => updateState('returnTime', e.target.value)}/>
            </div>
          </div>
        </div>
      )}
      {state.tripType === 'custom' ? (
         <div className="mt-8 bg-blue-50 p-6 rounded-xl text-center border border-blue-100 animate-fadeIn">
            <div className="inline-flex bg-blue-100 p-3 rounded-full text-blue-600 mb-3"><MessageCircle size={28} /></div>
            <h4 className="font-bold text-blue-900 mb-2 text-lg">{t.multiStopTitle}</h4>
            <p className="text-blue-800 mb-6 text-sm max-w-sm mx-auto">{t.multiStopDesc}</p>
            <button onClick={handleCustomQuoteClick} className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-3 rounded-full font-bold hover:bg-[#128C7E] shadow-lg flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105">{t.customQuote} <ArrowRight size={18} /></button>
         </div>
      ) : (
        <div className="pt-4 flex justify-end">
          <button onClick={nextStep} disabled={!state.fromLocation || !state.toLocation || !state.date} className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all">{t.next} <ChevronRight size={18} className="ml-1" /></button>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800">{t.title2}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2"><Users size={16} /> {t.adults}</label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('paxAdults', Math.max(1, state.paxAdults - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-12 text-center">{state.paxAdults}</span>
             <button onClick={() => updateState('paxAdults', Math.min(16, state.paxAdults + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2"><Baby size={16} /> {t.children}</label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('paxChildren', Math.max(0, state.paxChildren - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-12 text-center">{state.paxChildren}</span>
             <button onClick={() => updateState('paxChildren', Math.min(10, state.paxChildren + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-200 my-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2"><Briefcase size={16} /> {t.largeLug}</label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('luggageLarge', Math.max(0, state.luggageLarge - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-8 text-center">{state.luggageLarge}</span>
             <button onClick={() => updateState('luggageLarge', Math.min(10, state.luggageLarge + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2"><ShoppingBag size={16} /> {t.medLug}</label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('luggageMedium', Math.max(0, state.luggageMedium - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-8 text-center">{state.luggageMedium}</span>
             <button onClick={() => updateState('luggageMedium', Math.min(10, state.luggageMedium + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2"><Briefcase size={16} className="scale-75" /> {t.smallLug}</label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('luggageSmall', Math.max(0, state.luggageSmall - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-8 text-center">{state.luggageSmall}</span>
             <button onClick={() => updateState('luggageSmall', Math.min(10, state.luggageSmall + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2"><Backpack size={16} /> {t.handLug}</label>
          <div className="flex items-center gap-3">
             <button onClick={() => updateState('luggageHandCarry', Math.max(0, state.luggageHandCarry - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">-</button>
             <span className="text-xl font-bold w-8 text-center">{state.luggageHandCarry}</span>
             <button onClick={() => updateState('luggageHandCarry', Math.min(10, state.luggageHandCarry + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
          </div>
        </div>
      </div>
      <div className="pt-6 flex justify-between">
        <button onClick={prevStep} className="text-gray-600 font-medium hover:text-gray-900 flex items-center"><ChevronLeft size={18} /> {t.back}</button>
        <button onClick={nextStep} className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 flex items-center transition-all">{t.seeVehicles} <ChevronRight size={18} className="ml-1" /></button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const totalPax = state.paxAdults + state.paxChildren;
    return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{t.title3}</h3>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {availableVehicles.map((vehicle) => (
          <div key={vehicle.type} onClick={() => vehicle.isCapacityOk && updateState('selectedVehicle', vehicle.type)} className={`relative flex flex-col sm:flex-row items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${state.selectedVehicle === vehicle.type ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-primary-200'} ${!vehicle.isCapacityOk ? 'opacity-60 grayscale cursor-not-allowed bg-gray-50' : ''}`}>
            <div className="w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden mb-3 sm:mb-0"><img src={vehicle.image} alt={vehicle.type} className="w-full h-full object-cover" /></div>
            <div className="flex-1 px-4 text-center sm:text-left">
              <h4 className="font-bold text-gray-900">{vehicle.type === VehicleType.SEDAN ? (lang === 'en' ? 'Sedan' : '轿车') : vehicle.type === VehicleType.MPV_STD ? (lang === 'en' ? 'Standard MPV' : '标准MPV') : vehicle.type === VehicleType.MPV_LUX ? (lang === 'en' ? 'Luxury MPV' : '豪华MPV') : (lang === 'en' ? 'Large Multi MPV' : '大型MPV')}</h4>
              <p className="text-xs text-gray-500 mb-2">{lang === 'en' ? vehicle.description : (vehicle.type === VehicleType.SEDAN ? "适合夫妻或小家庭。舒适且经济。" : vehicle.type === VehicleType.MPV_STD ? "丰田 Innova 或 Perodua Aruz。适合家庭，行李空间更大。" : vehicle.type === VehicleType.MPV_LUX ? "丰田 Alphard / Vellfire。VIP舒适体验，配备航空座椅和宽敞腿部空间。" : "现代 Starex 或类似车型。宽敞的多用途车辆，适合较大型团体。")}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-gray-600"><span className={`flex items-center gap-1 ${totalPax > vehicle.maxPax ? 'text-red-500 font-bold' : ''}`}><Users size={12}/> {lang === 'en' ? `Max ${vehicle.maxPax} Pax` : `最高 ${vehicle.maxPax} 位乘客`}</span><span className="flex items-center gap-1"><Briefcase size={12}/> {lang === 'en' ? `Max ${vehicle.maxLuggage} bags` : `最多 ${vehicle.maxLuggage} 件行李`}</span></div>
              {!vehicle.isCapacityOk && <p className="text-red-500 text-xs font-semibold mt-1">{totalPax > vehicle.maxPax ? t.tooManyPax : t.lugExceeded}</p>}
            </div>
            <div className="text-right mt-2 sm:mt-0 flex flex-col items-end">
               <div className={`font-bold text-lg ${vehicle.priceInfo.isQuote ? 'text-gray-800' : 'text-primary-700'}`}>{vehicle.priceInfo.display}</div>
               {vehicle.priceInfo.tags.length > 0 && <div className="flex flex-wrap gap-1 justify-end mt-1 max-w-[150px]">{vehicle.priceInfo.tags.map(t => <span key={t} className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full font-semibold">{t}</span>)}</div>}
            </div>
            {state.selectedVehicle === vehicle.type && <div className="absolute top-2 right-2 text-primary-600"><CheckCircle size={20} fill="currentColor" className="text-white" /></div>}
          </div>
        ))}
      </div>
      <div className="pt-4 flex justify-between items-center">
        <button onClick={prevStep} className="text-gray-600 font-medium hover:text-gray-900 flex items-center"><ChevronLeft size={18} /> {t.back}</button>
        <button onClick={nextStep} disabled={!state.selectedVehicle} className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center transition-all">{t.confirm} <ChevronRight size={18} className="ml-1" /></button>
      </div>
    </div>
  )};

  const renderStep4 = () => {
      const priceInfo = calculateTotal(state.selectedVehicle!);
      return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{t.title4}</h3>
      <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-200">
        <div className="flex justify-between items-start">
            <div className="flex-1"><div className="text-sm text-gray-500">{t.route}</div><div className="font-medium">{state.fromLocation} → {state.toLocation}</div></div>
            <div className="text-right"><div className="text-sm text-gray-500">{t.estTotal}</div><div className="font-bold text-xl text-primary-700">{priceInfo.display}</div></div>
        </div>
      </div>
      <div className="space-y-3">
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" /><input type="text" placeholder={lang === 'en' ? "Enter your name" : "输入您的姓名"} className={`${inputBaseClass}`} value={state.name} onChange={(e) => updateState('name', e.target.value)}/></div>
         </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
             <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" /><input type="tel" placeholder={lang === 'en' ? "+65 / +60 Number" : "WhatsApp 或 电话号码"} className={`${inputBaseClass}`} value={state.phone} onChange={(e) => updateState('phone', e.target.value)}/></div>
         </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.requests}</label>
            <div className="relative"><Edit3 className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none z-10" /><textarea placeholder={t.notes} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-24 text-base" value={state.notes} onChange={(e) => updateState('notes', e.target.value)}/></div>
         </div>
      </div>
      <div className="pt-4 flex flex-col gap-3">
        <button onClick={handleWhatsAppClick} disabled={!state.name || !state.phone} className="w-full bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all"><span>{priceInfo.isQuote ? t.customQuote : t.bookWa}</span><ArrowRight size={20} /></button>
        <button onClick={prevStep} className="text-gray-500 text-sm text-center hover:underline">{t.edit}</button>
      </div>
    </div>
  )};

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg mx-auto relative overflow-hidden">
      <div className="flex justify-between mb-8 relative">
         <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10"></div>
         {[1, 2, 3, 4].map(s => (
             <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${state.step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
         ))}
      </div>
      {state.step === 1 && renderStep1()}
      {state.step === 2 && renderStep2()}
      {state.step === 3 && renderStep3()}
      {state.step === 4 && renderStep4()}
    </div>
  );
};
