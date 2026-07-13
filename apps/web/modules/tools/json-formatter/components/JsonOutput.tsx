import React from 'react';

interface JsonOutputProps {
  value: string;
}

export function JsonOutput({ value }: JsonOutputProps) {
  return (
    <div className="flex flex-col w-full h-full">
      <label className="text-sm font-semibold mb-2" htmlFor="json-output">
        Output JSON
      </label>
      <textarea
        id="json-output"
        className="flex-grow p-4 font-mono text-sm border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        readOnly
        placeholder="Formatted JSON will appear here..."
      />
    </div>
  );
}
