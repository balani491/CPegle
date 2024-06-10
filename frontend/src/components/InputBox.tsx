import React, { ChangeEvent } from 'react';

// Define the prop types
interface InputBoxProps {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Functional component with type annotations
export const InputBox: React.FC<InputBoxProps> = ({ label, placeholder, onChange }) => {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">
        {label}
      </div>
      <input
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded border-slate-200"
      />
    </div>
  );
};
