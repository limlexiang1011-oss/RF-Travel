
import React, { useState } from 'react';
import { PRICING_MATRIX } from '../constants';
import { VehicleType } from '../types';

export const PriceTable: React.FC<{ onBook: (from: string, to: string) => void }> = ({ onBook }) => {
  const [activeTab, setActiveTab] = useState<'SG' | 'JB' | 'KL'>('SG');

  const filteredRoutes = PRICING_MATRIX.filter(r => {
    if (activeTab === 'SG') return r.from === 'Singapore';
    if (activeTab === 'JB') return r.from === 'Johor Bahru';
    if (activeTab === 'KL') return r.from === 'Kuala Lumpur';
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
            From {tab === 'SG' ? 'Singapore' : tab === 'JB' ? 'Johor Bahru' : 'Kuala Lumpur'}
          </button>
        ))}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">Sedan (4)</th>
              <th className="px-6 py-3">MPV (7)</th>
              <th className="px-6 py-3">Alphard</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((route, idx) => {
              const isSgd = route.from.toLowerCase().includes('singapore') || route.to.toLowerCase().includes('singapore');
              const currency = isSgd ? 'SGD' : 'RM';
              
              const formatPrice = (price: number | undefined) => {
                 if (!price) return '-';
                 const val = isSgd ? Math.ceil(price / 3.2) : price;
                 return `${currency} ${val}`;
              };

              return (
                <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{route.to}</td>
                  <td className="px-6 py-4 text-gray-600">{formatPrice(route.prices[VehicleType.SEDAN])}</td>
                  <td className="px-6 py-4 font-bold text-primary-700">{formatPrice(route.prices[VehicleType.MPV_STD])}</td>
                  <td className="px-6 py-4 text-gray-600">{formatPrice(route.prices[VehicleType.MPV_LUX])}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onBook(route.from, route.to)}
                      className="text-primary-600 hover:underline font-semibold text-xs uppercase"
                    >
                      Book
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredRoutes.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No popular routes displayed. Use the booking form for a custom quote.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
