import React from 'react';
import { Link } from 'react-router-dom';

// Define the prop types
interface BottomWarningProps {
  label: string;
  buttonText: string;
  to: string;
}

// Functional component with type annotations
export const BottomWarning: React.FC<BottomWarningProps> = ({ label, buttonText, to }) => {
  return (
    <div className="py-2 text-sm flex justify-center">
      <div>
        {label}
      </div>
      <Link className="pointer underline pl-1 cursor-pointer" to={to}>
        {buttonText}
      </Link>
    </div>
  );
}
