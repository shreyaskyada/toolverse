import React from 'react';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export function JsonInput({ value, onChange, error }: JsonInputProps) {
  return (
    <div className="flex flex-col w-full h-full">
      <label className="text-sm font-semibold mb-2" htmlFor="json-input">
        Input JSON
      </label>
      <textarea
        id="json-input"
        className={`flex-grow p-4 font-mono text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your JSON here..."
      />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
