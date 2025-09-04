
import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="cursor-pointer border-b border-dashed border-gray-500">{children}</span>
      {visible && (
        <div 
          className="absolute bottom-full mb-2 w-64 p-3 bg-gray-700 text-white text-sm rounded-lg shadow-lg z-10"
          style={{ transform: 'translateX(-50%)', left: '50%' }}
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-700"></div>
        </div>
      )}
    </div>
  );
};
