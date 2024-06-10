import React from 'react';

interface AppbarProps {
  name: string;
}

export const Appbar: React.FC<AppbarProps> = ({ name }) => {
  return (
    <div className="h-14 flex justify-between bg-cyan-900">
      <div className="flex flex-col justify-center h-full ml-4 text-white text-lg font-bold">
        CodeBattle
      </div>
      <div className="flex items-center mr-4 text-white">
        <div className="flex flex-col justify-center h-full text-lg">
          {name}
        </div>
      </div>
    </div>
  );
}
