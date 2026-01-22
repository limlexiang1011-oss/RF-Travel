
import React, { useState, useEffect, useMemo } from 'react';
import { BookingState, VehicleType, Language } from '../types.ts';
import { LOCATIONS, VEHICLES, PRICING_MATRIX, WHATSAPP_NUMBER, SURCHARGE_CONFIG, PEAK_DATES, GOOGLE_SHEET_SCRIPT_URL } from '../constants.ts';
import { MapPin, Calendar, Clock, Users, CheckCircle, ChevronLeft, ArrowRight, User, Phone, Baby, ChevronDown, Briefcase, MessageCircle } from 'lucide-react';
import { translations } from '../translations.ts';

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
  luggageLarge: 0,
  luggageMedium: 0,
  luggageSmall: 0,
  luggageHandCarry: 0,
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
      let from = prefillRoute.from;
      let to = prefillRoute.to;

      // Map common shorthand names to full canonical location strings
      if (from === "Singapore") from = "Singapore - City / Hotel";
      if (from === "Johor Bahru") from = "Johor Bahru - City / JB Sentral";
      if (from === "Kuala Lumpur" || from === "City Area") from = "Kuala Lumpur - City Area";
      if (from === "KLIA") from = "Kuala Lumpur - KLIA 1/2";

      if (to === "Singapore") to = "Singapore - City / Hotel";
      if (to === "Johor Bahru") to = "Johor Bahru - City / JB Sentral";
      if (to === "Kuala Lumpur" || to === "City Area") to = "Kuala Lumpur - City Area";
      if (to === "KLIA") to = "Kuala Lumpur - KLIA 1/2";
      if (to === "Genting") to = "Genting Highlands";
      if (to === "Cameron") to = "Cameron Highlands";

      setState(prev => ({
        ...prev,
        fromLocation: from,
        toLocation: to,
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits 0-9 and the plus (+) symbol.
    const val = e.target.value.replace(/[^0-9+]/g, '');
    updateState('phone', val);
  };

  const nextStep = () => updateState('step', state.step + 1);
  const prevStep = () => updateState('step', state.step - 1);

  const checkIsPeak = (dateStr: string) => PEAK_DATES.includes(dateStr);

  const getLegPrice = (fromLoc: string, toLoc: string, date: string, time: string, vehicleType: VehicleType): PriceDetail => {
    if (!fromLoc || !toLoc) return { price: 0, currency: 'RM', tags: [], isQuoteRequired: false };
    const from = fromLoc.toLowerCase();
    const to = toLoc.toLowerCase();
    const isSgd = from.includes('singapore') || to.includes('singapore');
    const currency = isSgd ? 'SGD' : 'RM';
    let route = PRICING_MATRIX.find(r => from.includes(r.from.toLowerCase()) && to.includes(r.to.toLowerCase()));
    if (!route) {
        route = PRICING_MATRIX.find(r => to.includes(r.from.toLowerCase()) && from.includes(r.to.toLowerCase()));
    }
    if (!route) {
        if ((from.includes('singapore') && to.includes('johor')) || (from.includes('johor') && to.includes('singapore'))) {
             route = PRICING_MATRIX.find(r => r.from === "Singapore" && r.to.includes("Johor Bahru"));
        }
    }
    let basePrice = 0;
    if (route && route.prices[vehicleType]) {
      basePrice = route.prices[vehicleType] || 0;
    }
    if (basePrice === 0) return { price: 0, currency, tags: [], isQuoteRequired: true };
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
    return { price: Math.ceil(priceInCurrency), currency, tags, isQuoteRequired: false };
  };

  const calculateTotal = (vehicleType: VehicleType) => {
    if (state.tripType === 'day-trip') {
       return { display: lang === 'en' ? 'Contact for Quote' : '部分路线较少见，价格会为您单独计算', isQuote: true, tags: [lang === 'en' ? `Day Trip (${state.dayTripDuration} Hours)` : `包车一日游 (${state.dayTripDuration}小时)`] };
    }
    const outbound = getLegPrice(state.fromLocation, state.toLocation, state.date, state.time, vehicleType);
    const quoteLabel = lang === 'en' ? 'Quote Required' : '部分路线较少见，价格会为您单独计算';
    if (outbound.isQuoteRequired) return { display: quoteLabel, isQuote: true, tags: outbound.tags };
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
      if (inbound.isQuoteRequired) return { display: quoteLabel, isQuote: true, tags: [...allTags, ...inbound.tags] };
      allTags = [...new Set([...allTags, ...inbound.tags])];
      displayStr = outbound.currency === inbound.currency ? `${outbound.currency} ${outbound.price + inbound.price}` : `${outbound.currency} ${outbound.price} + ${inbound.currency} ${inbound.price}`;
    } else {
      return { display: lang === 'en' ? 'Custom Quote' : '定制报价', isQuote: true, tags: [] };
    }
    return { display: displayStr, isQuote: false, tags: allTags };
  };

  const availableVehicles = useMemo(() => {
    const luggageScore = (state.luggageLarge * 1.5) + (state.luggageMedium * 1.0) + (state.luggageSmall * 0.5) + (state.luggageHandCarry * 0.2);
    const totalPax = state.paxAdults + state.paxChildren;
    return VEHICLES.map(v => {
      const isCapacityOk = totalPax <= v.maxPax && luggageScore <= (v.maxLuggage * 1.5); 
      const priceInfo = calculateTotal(v.type);
      return { ...v, isCapacityOk, priceInfo };
    });
  }, [state, lang]);

  const handleWhatsAppClick = async () => {
    const selectedVehicleType = state.selectedVehicle || VEHICLES[0].type;
    const priceInfo = calculateTotal(selectedVehicleType);
    const priceDisplay = priceInfo.isQuote ? "Quote Required" : priceInfo.display;

    // --- Google Sheets Integration ---
    if (GOOGLE_SHEET_SCRIPT_URL) {
      try {
        const pickupCombined = `${state.date} ${state.time}`;
        const returnCombined = state.returnDate ? `${state.returnDate} ${state.returnTime || '12:00'}` : "";

        const params = new URLSearchParams();
        params.append("Timestamp", new Date().toLocaleString());
        params.append("Name", String(state.name || "Anonymous"));
        params.append("Phone", String(state.phone || "N/A"));
        params.append("TripType", String(state.tripType));
        params.append("From", String(state.fromLocation));
        params.append("To", String(state.toLocation));
        params.append("DateTime", String(pickupCombined)); 
        params.append("ReturnFrom", String(state.returnFromLocation || ""));
        params.append("ReturnTo", String(state.returnToLocation || ""));
        params.append("ReturnDate", String(returnCombined)); 
        params.append("Vehicle", String(selectedVehicleType));
        params.append("Price", String(priceDisplay));
        params.append("Pax", `${state.paxAdults} Adt, ${state.paxChildren} Chd`);
        params.append("Luggage", `L:${state.luggageLarge}, M:${state.luggageMedium}, S:${state.luggageSmall}, H:${state.luggageHandCarry}`);
        params.append("Notes", String(state.notes || ""));

        fetch(GOOGLE_SHEET_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        }).catch(err => console.error("Sheets Error:", err));
      } catch (e) {
        console.warn("Sheets init error:", e);
      }
    }

    // --- Analytics & WhatsApp ---
    try {
      if (typeof (window as any).gtag === 'function') (window as any).gtag('event', 'conversion', { 'send_to': 'AW-17810501351/ic3rCKj_w9QbEOfd2qxC' });
      if (typeof (window as any).fbq === 'function') (window as any).fbq('track', 'Contact');
    } catch (e) {}

    const returnDetails = state.tripType === 'round-trip' ? `\n*Return Trip:* ${state.returnFromLocation} to ${state.returnToLocation} on ${state.returnDate} @ ${state.returnTime}` : '';
    const totalPax = state.paxAdults + state.paxChildren;
    const luggageSummary = [state.luggageLarge > 0 ? `${state.luggageLarge} Large` : '', state.luggageMedium > 0 ? `${state.luggageMedium} Med` : '', state.luggageSmall > 0 ? `${state.luggageSmall} Small` : '', state.luggageHandCarry > 0 ? `${state.luggageHandCarry} Hand` : ''].filter(Boolean).join(', ') || 'None';
    const msg = `Hi, I’m interested in your Charter Car Service form Website. 我想咨询关于包车服务的有关详情\n\n*Trip:* ${state.fromLocation} to ${state.toLocation}\n*Date:* ${state.date} @ ${state.time}\n*Type:* ${state.tripType}${returnDetails}\n*Pax:* ${totalPax}\n*Vehicle:* ${selectedVehicleType}\n*Luggage:* ${luggageSummary}\n*Est. Price:* ${priceDisplay}\n*Name:* ${state.name || 'N/A'}\n*Phone:* ${state.phone || 'N/A'}\n*Notes:* ${state.notes || 'None'}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCustomQuoteClick = () => {
    const totalPax = state.paxAdults + state.paxChildren;
    const msg = `Hi, I’m interested in your Charter Car Service form Website. 我想咨询关于包车服务的有关详情\n\n*Pickup:* ${state.fromLocation || 'TBD'}\n*Destination:* ${state.toLocation || 'TBD'}\n*Date:* ${state.date || 'TBD'}\n*Pax:* ${totalPax || 'TBD'}\n\nI have a custom itinerary. Please provide a quote.`.trim();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const inputBaseClass = "w-full h-12 pl-10 pr-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-base transition-all";
  const selectClass = `${inputBaseClass} appearance-none pr-10`; 

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg mx-auto relative overflow-hidden">
      <div className="flex justify-between mb-8 relative">
         <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10"></div>
         {[1, 2, 3, 4].map(s => (<div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${state.step >= s ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-gray-200 text-gray-500'}`}>{s}</div>))}
      </div>
      {state.step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t.title1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.pickup}</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" /><select className={selectClass} value={state.fromLocation} onChange={(e) => updateState('fromLocation', e.target.value)}><option value="">{t.selectOrigin}</option>{LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.dest}</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" /><select className={selectClass} value={state.toLocation} onChange={(e) => updateState('toLocation', e.target.value)}><option value="">{t.selectDest}</option>{LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" /></div></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.date}</label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" /><input type="date" className={`${inputBaseClass} appearance-none`} value={state.date} onChange={(e) => updateState('date', e.target.value)}/></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.time}</label><div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" /><input type="time" className={`${inputBaseClass} appearance-none`} value={state.time} onChange={(e) => updateState('time', e.target.value)}/></div></div>
          </div>
          <div className="flex flex-wrap gap-4 py-2 border-b border-gray-100">
             {['one-way', 'round-trip', 'day-trip', 'custom'].map(type => (<label key={type} className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={state.tripType === type} onChange={() => updateState('tripType', type)} className="w-5 h-5 text-primary-600 focus:ring-primary-500"/><span className="font-medium text-gray-700">{t[type === 'one-way' ? 'oneWay' : type === 'round-trip' ? 'roundTrip' : type === 'day-trip' ? 'dayTrip' : 'multiStop']}</span></label>))}
          </div>
          {state.tripType === 'day-trip' && <div className="bg-orange-50 p-4 rounded-xl border border-orange-100"><div className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2"><Clock size={16}/> {t.duration}</div><div className="flex gap-4">{[10, 12].map(h => <button key={h} onClick={() => updateState('dayTripDuration', h)} className={`flex-1 py-3 rounded-lg border font-semibold ${state.dayTripDuration === h ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-white text-gray-600 border-gray-200'}`}>{h} {t.hours}</button>)}</div></div>}
          {state.tripType === 'round-trip' && (
            <div className="space-y-4 bg-primary-50 p-4 rounded-xl border border-primary-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.returnPickup}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                    <select 
                      className={selectClass} 
                      value={state.returnFromLocation || ''} 
                      onChange={(e) => updateState('returnFromLocation', e.target.value)}
                    >
                      <option value="">{t.selectOrigin}</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.returnDest}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                    <select 
                      className={selectClass} 
                      value={state.returnToLocation || ''} 
                      onChange={(e) => updateState('returnToLocation', e.target.value)}
                    >
                      <option value="">{t.selectDest}</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.returnDate}</label>
                  <input type="date" className={inputBaseClass} value={state.returnDate || ''} onChange={(e) => updateState('returnDate', e.target.value)}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.returnTime}</label>
                  <input type="time" className={inputBaseClass} value={state.returnTime || ''} onChange={(e) => updateState('returnTime', e.target.value)}/>
                </div>
              </div>
            </div>
          )}
          {state.tripType === 'custom' ? (<div className="bg-blue-50 p-6 rounded-xl text-center"><button onClick={handleCustomQuoteClick} className="w-full btn-premium-green btn-shine px-8 py-3 rounded-full font-bold shadow-lg">{t.customQuote}</button></div>) : (<div className="pt-4 flex justify-end"><button onClick={nextStep} disabled={!state.fromLocation || !state.toLocation || !state.date} className="btn-premium btn-shine px-8 py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed">{t.next}</button></div>)}
        </div>
      )}
      {state.step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800">{t.title2}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2"><Users size={16} /> {t.adults}</label>
              <div className="flex items-center gap-3">
                <button onClick={() => updateState('paxAdults', Math.max(1, state.paxAdults - 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                <span className="text-xl font-bold w-12 text-center">{state.paxAdults}</span>
                <button onClick={() => updateState('paxAdults', state.paxAdults + 1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
              </div>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2 gap-2"><Baby size={16} /> {t.children}</label>
              <div className="flex items-center gap-3">
                <button onClick={() => updateState('paxChildren', Math.max(0, state.paxChildren - 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                <span className="text-xl font-bold w-12 text-center">{state.paxChildren}</span>
                <button onClick={() => updateState('paxChildren', state.paxChildren + 1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase size={14} /> {lang === 'en' ? 'Luggage Count' : '行李数量'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { key: 'luggageLarge', label: t.largeLug },
                { key: 'luggageMedium', label: t.medLug },
                { key: 'luggageSmall', label: t.smallLug },
                { key: 'luggageHandCarry', label: t.handLug }
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-xs text-gray-500 mb-2">{item.label}</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateState(item.key as any, Math.max(0, (state as any)[item.key] - 1))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500">-</button>
                    <span className="text-lg font-bold w-8 text-center">{(state as any)[item.key]}</span>
                    <button onClick={() => updateState(item.key as any, (state as any)[item.key] + 1)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex justify-between">
            <button onClick={prevStep} className="text-gray-600 font-medium flex items-center hover:text-gray-900 transition-colors"><ChevronLeft size={18} /> {t.back}</button>
            <button onClick={nextStep} className="btn-premium btn-shine px-8 py-3 rounded-full font-semibold">{t.seeVehicles}</button>
          </div>
        </div>
      )}
      {state.step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t.title3}</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {availableVehicles.map((vehicle) => (
              <div key={vehicle.type} onClick={() => vehicle.isCapacityOk && updateState('selectedVehicle', vehicle.type)} className={`flex flex-col sm:flex-row items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${state.selectedVehicle === vehicle.type ? 'border-primary-500 bg-primary-50' : 'border-gray-200'} ${!vehicle.isCapacityOk ? 'opacity-40 grayscale cursor-not-allowed bg-gray-50' : 'hover:border-primary-200 hover:shadow-sm'}`}>
                {/* Updated Image Container: Significantly larger and uses object-contain */}
                <div className="w-full sm:w-48 h-36 sm:h-32 bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-4 flex-shrink-0 p-2 border border-gray-100">
                    <img src={vehicle.image} alt={vehicle.type} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                
                <div className="flex-1 px-2 text-center sm:text-left w-full">
                   <h4 className="font-bold text-gray-900 text-lg mb-1">{lang === 'en' ? vehicle.type : (vehicle.type === 'Sedan' ? '轿车' : vehicle.type === 'Standard MPV' ? '标准MPV' : vehicle.type === 'Luxury MPV' ? '豪华MPV' : '大型MPV')}</h4>
                   <div className={`flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start ${vehicle.priceInfo.isQuote ? 'mt-1' : ''}`}>
                      <p className="text-base font-semibold text-primary-700">{vehicle.priceInfo.display}</p>
                      {vehicle.priceInfo.isQuote && (
                        <button 
                           onClick={(e) => { 
                             e.stopPropagation(); 
                             updateState('selectedVehicle', vehicle.type); 
                             nextStep(); 
                           }}
                           className="flex items-center gap-1 px-3 py-1 btn-premium-green btn-shine rounded-full text-[10px] font-bold shadow-sm"
                        >
                           <MessageCircle size={10} /> {lang === 'en' ? 'Get Quote' : '咨询报价'}
                        </button>
                      )}
                   </div>
                   {vehicle.priceInfo.isQuote && (
                     <p className="text-[10px] text-gray-500 mt-1 font-medium leading-tight">
                       {lang === 'en' ? 'Welcome to contact us directly for a fast and accurate quote.' : '欢迎直接联系我们，快速给您准确报价'}
                     </p>
                   )}
                   {!vehicle.isCapacityOk && <p className="text-xs text-red-500 mt-2 font-medium bg-red-50 inline-block px-2 py-1 rounded">{lang === 'en' ? 'Exceeds Capacity' : '人数或行李超限'}</p>}
                </div>
                {state.selectedVehicle === vehicle.type && <div className="mt-3 sm:mt-0"><CheckCircle size={28} className="text-primary-600" /></div>}
              </div>
            ))}
          </div>
          <div className="pt-4 flex justify-between"><button onClick={prevStep} className="text-gray-600 font-medium flex items-center hover:text-gray-900 transition-colors"><ChevronLeft size={18} /> {t.back}</button><button onClick={nextStep} disabled={!state.selectedVehicle} className="btn-premium btn-shine px-8 py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed">{t.confirm}</button></div>
        </div>
      )}
      {state.step === 4 && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t.title4}</h3>
          <div className="space-y-3">
             <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 text-gray-400" /><input type="text" className={inputBaseClass} value={state.name} onChange={(e) => updateState('name', e.target.value)}/></div></div>
             <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 text-gray-400" /><input type="tel" className={inputBaseClass} value={state.phone} onChange={handlePhoneChange} placeholder="Example: +60123456789"/></div></div>
             <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.requests}</label><textarea className="w-full p-3 border rounded-xl h-24 text-sm focus:ring-2 focus:ring-primary-500 outline-none" value={state.notes} onChange={(e) => updateState('notes', e.target.value)}/></div>
          </div>
          <div className="pt-4"><button onClick={handleWhatsAppClick} disabled={!state.name || !state.phone} className="w-full btn-premium-green btn-shine px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"><span>{t.bookWa}</span><ArrowRight size={20} /></button></div>
        </div>
      )}
    </div>
  );
};
