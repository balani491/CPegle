import React from 'react';

// Define the prop types
interface HeadingProps {
  label: string;
}

// Functional component with type annotations
export const Heading: React.FC<HeadingProps> = ({ label }) => {
  return (
    <div className="font-bold text-4xl pt-6">
      {label}
    </div>
  );
};
