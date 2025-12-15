
import React, { useState } from 'react';
import { PRICING_MATRIX } from '../constants';
import { VehicleType } from '../types';

export const PriceTable: React.FC<{ onBook: (from: string, to: string) => void }> = ({ onBook }) => {
  const [activeTab, setActiveTab] = useState<'SG' | 'JB' | 'KL'>('SG');

  const filteredRoutes = PRICING_MATRIX.filter(r => {
    if (activeTab === 'SG') return r.from === 'Singapore';
    if (activeTab === 'JB') return r.from === 'Johor Bahru';
    if (activeTab === 'KL') return r.from === 'Kuala Lumpur' || r.from === 'City Center' || r.from === 'City Area' || r.from === 'KLIA';
    return false;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex border-b">
        {(['SG', 'JB', 'KL'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-center font-bold text-lg transition-colors ${activeTab === tab ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            {tab === 'SG' ? 'Singapore' : tab === 'JB' ? 'Johor Bahru' : 'Kuala Lumpur'}
          </button>
        ))}
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead className="text-[10px] md:text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-2 py-3 md:px-6 align-bottom">Dest.</th>
              <th className="px-1 py-2 md:px-6 md:py-3 text-left align-bottom min-w-[50px]">
                <div className="leading-tight">Sedan<br/><span className="text-gray-400 normal-case">(4)</span></div>
              </th>
              <th className="px-1 py-2 md:px-6 md:py-3 text-left align-bottom min-w-[50px]">
                <div className="leading-tight">Standard<br/><span className="text-gray-400 normal-case">(6)</span></div>
              </th>
              <th className="px-1 py-2 md:px-6 md:py-3 text-left align-bottom min-w-[50px]">
                 <div className="leading-tight">Luxury<br/><span className="text-gray-400 normal-case">(6-7)</span></div>
              </th>
              <th className="px-1 py-2 md:px-6 md:py-3 text-left align-bottom min-w-[50px]">
                 <div className="leading-tight">Large<br/><span className="text-gray-400 normal-case">(10)</span></div>
              </th>
              <th className="px-1 py-2 md:px-6 md:py-3 text-center align-bottom">
                 <span className="md:inline hidden">Action</span>
              </th>
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

              // Helper to display From location if it varies (specific for KL tab)
              const fromDisplay = activeTab === 'KL' && (route.from === 'KLIA' || route.from === 'City Area') 
                ? <span className="text-[10px] text-gray-500 block font-normal leading-tight mt-1">from {route.from === 'City Area' ? 'City' : 'KLIA'}</span>
                : null;
                
              // Format destination to split words for better mobile fit
              const formatDest = (dest: string) => {
                  // Ensure (10 Hour) and (12 Hour) stay together on one line if possible
                  const parts = dest.replace(/\((10|12) Hour\)/g, '|$&|').split('|').filter(Boolean);
                  
                  return parts.map((part, i) => {
                      // Check if this part is the time string
                      if (part.includes('Hour')) {
                          return <span key={i} className="block whitespace-nowrap">{part.trim()}</span>;
                      }
                      // Split other text by spaces
                      return part.trim().split(' ').map((word, wIdx) => (
                           <span key={`${i}-${wIdx}`} className="block">{word}</span>
                      ));
                  });
              };

              return (
                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-2 py-3 md:px-6 md:py-4 font-medium text-gray-900 align-middle">
                    <div className="leading-tight max-w-[70px] md:max-w-none break-words">
                        {formatDest(route.to)}
                    </div>
                    {fromDisplay}
                  </td>
                  <td className="px-1 py-2 md:px-6 md:py-4 align-middle border-l border-gray-50 md:border-none">
                      {renderPrice(route.prices[VehicleType.SEDAN])}
                  </td>
                  <td className="px-1 py-2 md:px-6 md:py-4 font-semibold align-middle bg-primary-50/30 md:bg-transparent">
                      {renderPrice(route.prices[VehicleType.MPV_STD])}
                  </td>
                  <td className="px-1 py-2 md:px-6 md:py-4 align-middle border-l border-gray-50 md:border-none">
                      {renderPrice(route.prices[VehicleType.MPV_LUX])}
                  </td>
                  <td className="px-1 py-2 md:px-6 md:py-4 align-middle border-l border-gray-50 md:border-none">
                      {renderPrice(route.prices[VehicleType.VAN])}
                  </td>
                  <td className="px-1 py-2 md:px-6 md:py-4 text-center align-middle">
                    <button 
                      onClick={() => onBook(activeTab === 'KL' ? (route.from === 'City Area' ? 'Kuala Lumpur - City Area' : 'Kuala Lumpur - KLIA 1/2') : route.from, route.to)}
                      className="bg-primary-600 text-white p-1.5 md:px-3 md:py-1 rounded-md hover:bg-primary-700 transition-colors shadow-sm"
                      aria-label="Book"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredRoutes.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">No popular routes displayed. Use the booking form for a custom quote.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
