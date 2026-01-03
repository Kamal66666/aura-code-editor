import React from 'react';

interface ButtonGroupOption {
  value: string;
  label: string;
  icon?: string;
}

interface ButtonGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ButtonGroupOption[];
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex border border-gray-300 rounded overflow-hidden">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex-1 px-3 py-2 text-sm font-medium transition-colors duration-200
              ${value === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }
              ${index > 0 ? 'border-l border-gray-300' : ''}
            `}
          >
            <div className="flex items-center justify-center gap-1">
              {option.icon && <span className="text-xs">{option.icon}</span>}
              <span>{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGroup;
