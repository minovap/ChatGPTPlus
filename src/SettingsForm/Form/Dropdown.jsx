import React from 'react';

function Dropdown({ id, label, value, onChange, options }) {
  return (
    <div className="pb-4"> 
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">{label}</label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
export default Dropdown;