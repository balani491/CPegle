import React from 'react';

// Define the prop types
interface SubHeadingProps {
  label: string;
}

// Functional component with type annotations
export const SubHeading: React.FC<SubHeadingProps> = ({ label }) => {
  return (
    <div className="text-slate-500 text-md pt-1 px-4 pb-4">
      {label}
    </div>
  );
};
