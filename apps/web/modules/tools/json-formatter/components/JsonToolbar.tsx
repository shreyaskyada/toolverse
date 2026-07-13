import React from 'react';

interface JsonToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onClear: () => void;
  disabled: boolean;
  spaces: number;
  onSpacesChange: (spaces: number) => void;
}

export function JsonToolbar({ onFormat, onMinify, onClear, disabled, spaces, onSpacesChange }: JsonToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 py-4">
      <button
        onClick={onFormat}
        disabled={disabled}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Format
      </button>
      <button
        onClick={onMinify}
        disabled={disabled}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Minify
      </button>
      <div className="flex items-center gap-2">
        <label htmlFor="spaces" className="text-sm font-medium">Spaces:</label>
        <select
          id="spaces"
          value={spaces}
          onChange={(e) => onSpacesChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-1"
        >
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={8}>8</option>
        </select>
      </div>
      <div className="flex-grow"></div>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
      >
        Clear
      </button>
    </div>
  );
}
