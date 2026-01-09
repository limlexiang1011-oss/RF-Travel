
import React, { useState } from 'react';
import { PRICING_MATRIX } from '../constants.ts';
import { VehicleType, Language } from '../types.ts';
import { translations } from '../translations.ts';

export const PriceTable: React.FC<{ onBook: (from: string, to: string) => void, lang: Language }> = ({ onBook, lang }) => {
  const [activeTab, setActiveTab] = useState<'SG' | 'JB' | 'KL'>('SG');
  const t = translations[lang].pricing;

  const filteredRoutes = PRICING_MATRIX.filter(r => {
    if (activeTab === 'SG') return r.from === 'Singapore';
    if (activeTab === 'JB') return r.from.includes('Johor Bahru');
    if (activeTab === 'KL') return r.from.includes('Kuala Lumpur');
    return false;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="flex items-center justify-between border-b bg-gray-50">
        <div className="flex flex-1">
          {(['SG', 'JB', 'KL'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`flex-1 py-4 text-center font-bold text-sm md:text-lg transition-colors border-r border-gray-100 last:border-r-0 ${activeTab === tab ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {tab === 'SG' ? (lang === 'en' ? 'Singapore' : '新加坡') : tab === 'JB' ? (lang === 'en' ? 'Johor Bahru' : '新山') : (lang === 'en' ? 'Kuala Lumpur' : '吉隆坡')}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead className="text-[10px] md:text-xs text-gray-700 uppercase bg-gray-50/50">
            <tr>
              <th className="px-2 py-3 md:px-6 align-bottom">{t.dest}</th>
              <th className="px-1 py-2 md:px-6 md:py-3 text-left align-bottom min-w-[50px]">{t.sedan}</th>
              <th className="px-1 py-2 md:px-6 md:py-3 text-left align-bottom min-w-[50px]">{t.standard}</th>
              <th className="px-1 py-2 md:px-6 md:py-3 text-left align-bottom min-w-[50px]">{t.luxury}</th>
              <th className="px-1 py-2 md:px-6 md:py-3 text-left align-bottom min-w-[50px]">{t.large}</th>
              <th className="px-1 py-2 md:px-6 md:py-3 text-center align-bottom">{t.action}</th>
            </tr>
          </thead>
          <tbody className="text-xs md:text-sm">
            {filteredRoutes.map((route, idx) => {
              const isSgd = route.from.toLowerCase().includes('singapore') || route.to.toLowerCase().includes('singapore');
              const currency = isSgd ? 'SGD' : 'RM';
              const renderPrice = (price: number | undefined) => {
                 if (!price) return <span className="text-gray-300 pl-1">-</span>;
                 const val = isSgd ? Math.ceil(price / 3.2) : price;
                 return (
                    <div className="flex flex-col items-start leading-none py-1">
                        <span className="text-[10px] text-gray-400 mb-1">{currency}</span>
                        <span className="font-bold text-gray-900 text-sm">{val}</span>
                    </div>
                 );
              };
              return (
                <tr key={idx} className="bg-white border-b hover:bg-gray-50/80 transition-colors">
                  <td className="px-2 py-3 md:px-6 md:py-4 font-medium text-gray-900 align-middle truncate max-w-[100px] md:max-w-none">
                    {route.labelTo || route.to}
                  </td>
                  <td className="px-1 py-2 md:px-6 md:py-4 align-middle">{renderPrice(route.prices[VehicleType.SEDAN])}</td>
                  <td className="px-1 py-2 md:px-6 md:py-4 font-semibold align-middle">{renderPrice(route.prices[VehicleType.MPV_STD])}</td>
                  <td className="px-1 py-2 md:px-6 md:py-4 align-middle">{renderPrice(route.prices[VehicleType.MPV_LUX])}</td>
                  <td className="px-1 py-2 md:px-6 md:py-4 align-middle">{renderPrice(route.prices[VehicleType.VAN])}</td>
                  <td className="px-1 py-2 md:px-6 md:py-4 text-center align-middle">
                    <button 
                      onClick={() => onBook(route.from, route.to)} 
                      className="bg-primary-600 text-white p-1.5 md:px-3 md:py-1 rounded-md shadow-sm hover:bg-primary-700 transition-colors active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
