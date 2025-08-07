import React from 'react';

const supplierDataTemplate = (city) => [
  {
    title: `${city} Submersible pump Ltd`,
    contact: '8441000844',
    address: `ABC ${city}`,
    pincode: '201301',
  },
  {
    title: `${city} WaterTech Solutions`,
    contact: '8442000845',
    address: `XYZ ${city}`,
    pincode: '201302',
  },
  {
    title: `${city} Pumps & Co.`,
    contact: '8443000846',
    address: `LMN ${city}`,
    pincode: '201303',
  },
  {
    title: `${city} FlowMasters`,
    contact: '8444000847',
    address: `PQR ${city}`,
    pincode: '201304',
  },
];

export default function SupplierCards({ city = 'Agra', inputValue = '', onSendDetails }) {
  const suppliers = supplierDataTemplate(city);
  return (
    <div className="grid grid-cols-2 gap-3 mb-4 w-full h-full">
      {suppliers.map((s, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-300 p-2 flex flex-col gap-1 text-xs min-w-0"
          style={{ minHeight: '90px' }}
        >
          <div className="font-semibold truncate" title={s.title}>{s.title}</div>
          <div>Contact: {s.contact}</div>
          <div className="truncate" title={`${s.address}, ${s.pincode}`}>{s.address}, {s.pincode}</div>
          <button
            className="self-end px-2 py-0.5 rounded bg-blue-500 text-white text-xs mt-1"
            onClick={() => onSendDetails && onSendDetails(s)}
          >
            Send Details
          </button>
        </div>
      ))}
    </div>
  );
}