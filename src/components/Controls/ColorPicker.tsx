import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.match(/^#[0-9A-Fa-f]{0,6}$/)) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleTextChange}
          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
