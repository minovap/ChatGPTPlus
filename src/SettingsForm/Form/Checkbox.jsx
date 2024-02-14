import React from 'react';

function Checkbox({ id, label, checked, onChange, description }) {
  return (
    <div className="relative flex items-start gap-x-3 pb-4">
      <div className="flex h-6 items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </div>
      <div className="text-sm leading-6">
        <label htmlFor={id} className="font-medium text-gray-900">{label}</label>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
    </div>
  );
}
export default Checkbox;