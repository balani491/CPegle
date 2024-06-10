import React from 'react';

// Define the prop types
interface ButtonProps {
  label: string;
  onClick: () => void; // Function type that takes no arguments and returns void
}

// Functional component with type annotations
export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full text-white bg-cyan-900 hover:bg-cyan-600 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
    >
      {label}
    </button>
  );
}
