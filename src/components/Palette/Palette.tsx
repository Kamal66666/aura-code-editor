import React, { useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { paletteComponents } from '../../data/paletteComponents';
import type { PaletteItem } from '../../types/editor';

const Palette: React.FC = () => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const { startPaletteDrag, setupGlobalListeners } = useDragAndDrop();

  useEffect(() => {
    const cleanup = setupGlobalListeners();
    return cleanup;
  }, [setupGlobalListeners]);

  const handleMouseDown = (e: React.MouseEvent, item: PaletteItem) => {
    startPaletteDrag(e, item);
  };

  return (
    <div className={`h-full flex flex-col ${isMobile ? 'p-2' : 'p-4'}`}>
      <div className="mb-4">
        <h2 className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : 'text-lg'}`}>
          Components
        </h2>
        <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          Drag to canvas
        </p>
      </div>
      
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {paletteComponents.map((item) => (
          <div
            key={item.type}
            onMouseDown={(e) => handleMouseDown(e, item)}
            className={`
              group relative bg-white border-2 border-gray-200 rounded-xl cursor-grab active:cursor-grabbing
              hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1
              transition-all duration-300 ease-out transform
              ${isMobile ? 'p-3' : 'p-4'}
            `}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center gap-3">
              {/* Icon with animated background */}
              <div className={`
                flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-blue-100
                transition-colors duration-300
                ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}
              `}>
                <span className={`${isMobile ? 'text-lg' : 'text-2xl'} group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </span>
              </div>
              
              <div className="flex-1">
                <div className={`font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {item.label}
                </div>
                {!isMobile && (
                  <div className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors duration-300 capitalize">
                    {item.type}
                  </div>
                )}
              </div>
              
              {/* Drag indicator */}
              <div className={`
                flex flex-col gap-1 opacity-30 group-hover:opacity-60 transition-opacity duration-300
                ${isMobile ? 'scale-75' : ''}
              `}>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
              </div>
            </div>
            
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse rounded-xl" />
          </div>
        ))}
      </div>
      
      {!isMobile && (
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-blue-500">💡</span>
            <span>Click and drag components to the canvas</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Native drag & drop • No external libraries
          </div>
        </div>
      )}
    </div>
  );
};

export default Palette;
