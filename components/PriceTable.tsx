
import React, { useState } from 'react';
import { PRICING_MATRIX } from '../constants.ts';
import { VehicleType, Language } from '../types.ts';
import { translations } from '../translations.ts';
import { MapPin } from 'lucide-react';

export const PriceTable: React.FC<{ onBook: (from: string, to: string) => void, lang: Language }> = ({ onBook, lang }) => {
  const [activeTab, setActiveTab] = useState<'SG' | 'JB' | 'KL'>('SG');
  const t = translations[lang].pricing;

  const filteredRoutes = PRICING_MATRIX.filter(r => {
    if (activeTab === 'SG') return r.from === 'Singapore';
    if (activeTab === 'JB') return r.from.includes('Johor Bahru');
    if (activeTab === 'KL') return r.from.includes('Kuala Lumpur');
    return false;
  });

  const getTabLabel = (tab: 'SG' | 'JB' | 'KL') => {
      if (tab === 'SG') return lang === 'en' ? 'Singapore' : '新加坡';
      if (tab === 'JB') return lang === 'en' ? 'Johor Bahru' : '新山';
      return lang === 'en' ? 'Kuala Lumpur' : '吉隆坡';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Modern Segmented Tab Control */}
      <div className="p-4 md:p-6 bg-white border-b border-gray-50">
        <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl mx-auto max-w-3xl relative">
          {(['SG', 'JB', 'KL'] as const).map(tab => {
            const isActive = activeTab === tab;
            return (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`
                  flex-1 py-3 md:py-4 px-2 rounded-xl text-sm md:text-base font-bold transition-all duration-300 ease-out relative
                  flex items-center justify-center gap-2
                  ${isActive 
                    ? 'bg-white text-primary-700 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] ring-1 ring-black/5 scale-[1.02] z-10' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-slate-200/50'
                  }
                `}
              >
                {isActive && <MapPin size={16} className="text-primary-500 animate-fadeIn" />}
                <span>{getTabLabel(tab)}</span>
              </button>
            );
          })}
        </div>
        <div className="text-center mt-3 text-xs text-gray-400 font-medium tracking-wide uppercase">
            {lang === 'en' ? 'Departing From' : '出发地'}
        </div>
      </div>
      
      {/* Table Container - Mobile optimized with fixed layout */}
      <div className="w-full">
        <table className="w-full text-left border-collapse table-fixed md:table-auto">
          <thead className="text-[10px] md:text-xs text-gray-700 uppercase bg-gray-50/50">
            <tr>
              {/* Widths adjusted: Dest 27%, Vehicles 15% each, Action 13% */}
              <th className="w-[27%] md:w-auto px-2 py-3 md:px-6 align-middle font-bold text-gray-600 tracking-wider">{t.dest}</th>
              <th className="w-[15%] md:w-auto px-0.5 py-3 md:px-6 text-center align-middle font-bold text-gray-600 tracking-wider whitespace-normal leading-tight">{t.sedan}</th>
              <th className="w-[15%] md:w-auto px-0.5 py-3 md:px-6 text-center align-middle font-bold text-gray-600 tracking-wider whitespace-normal leading-tight">{t.standard}</th>
              <th className="w-[15%] md:w-auto px-0.5 py-3 md:px-6 text-center align-middle font-bold text-gray-600 tracking-wider whitespace-normal leading-tight">{t.luxury}</th>
              <th className="w-[15%] md:w-auto px-0.5 py-3 md:px-6 text-center align-middle font-bold text-gray-600 tracking-wider whitespace-normal leading-tight">{t.large}</th>
              <th className="w-[13%] md:w-auto px-1 py-3 md:px-6 text-center align-middle font-bold text-gray-600 tracking-wider">{/* Action Header Icon or Empty */}</th>
            </tr>
          </thead>
          <tbody className="text-xs md:text-sm divide-y divide-gray-100">
            {filteredRoutes.map((route, idx) => {
              const isSgd = route.from.toLowerCase().includes('singapore') || route.to.toLowerCase().includes('singapore');
              const currency = isSgd ? 'SGD' : 'RM';
              const renderPrice = (price: number | undefined) => {
                 if (!price) return <span className="text-gray-300">-</span>;
                 const val = isSgd ? Math.ceil(price / 3.2) : price;
                 return (
                    <div className="flex flex-col items-center justify-center leading-none py-1 group cursor-default">
                        <span className="text-[9px] text-gray-400 mb-0.5 group-hover:text-primary-500 transition-colors scale-90">{currency}</span>
                        <span className="font-bold text-gray-900 text-xs md:text-base">{val}</span>
                    </div>
                 );
              };
              
              const labelText = route.labelTo || route.to;
              
              return (
                <tr key={idx} className="bg-white hover:bg-primary-50/30 transition-colors duration-200">
                  <td className="px-2 py-3 md:px-6 font-bold text-gray-800 align-middle whitespace-normal break-words leading-tight text-[11px] md:text-base border-l-4 border-transparent hover:border-primary-500 transition-all pl-1.5 md:pl-5">
                    {labelText.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < labelText.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </td>
                  <td className="px-0.5 py-2 md:px-6 align-middle text-center">{renderPrice(route.prices[VehicleType.SEDAN])}</td>
                  <td className="px-0.5 py-2 md:px-6 align-middle text-center">{renderPrice(route.prices[VehicleType.MPV_STD])}</td>
                  <td className="px-0.5 py-2 md:px-6 align-middle text-center">{renderPrice(route.prices[VehicleType.MPV_LUX])}</td>
                  <td className="px-0.5 py-2 md:px-6 align-middle text-center">{renderPrice(route.prices[VehicleType.VAN])}</td>
                  <td className="px-0.5 py-2 md:px-6 text-center align-middle">
                    <button 
                      onClick={() => onBook(route.from, route.to)} 
                      className="btn-premium btn-shine p-1.5 md:p-2 rounded-lg shadow-md active:scale-95 flex items-center justify-center mx-auto hover:shadow-lg transition-all"
                      aria-label="Book this route"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
