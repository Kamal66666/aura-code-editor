import React from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'url' | 'email';
  multiline?: boolean;
  rows?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  multiline = false,
  rows = 3,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const baseClasses = "w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={baseClasses}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
};

export default TextInput;
