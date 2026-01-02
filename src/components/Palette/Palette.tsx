import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import type { PaletteItem } from '../../types/editor';

const paletteItems: PaletteItem[] = [
  {
    type: 'text',
    label: 'Text',
    icon: '📝',
    defaultProps: {
      type: 'text',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 40 },
      properties: {
        content: 'Sample Text',
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left',
        fontFamily: 'Arial, sans-serif',
      },
    },
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: '📄',
    defaultProps: {
      type: 'textarea',
      position: { x: 0, y: 0 },
      size: { width: 300, height: 120 },
      properties: {
        placeholder: 'Enter text here...',
        rows: 4,
        cols: 30,
        resize: 'both',
      },
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: '🖼️',
    defaultProps: {
      type: 'image',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 150 },
      properties: {
        src: 'https://via.placeholder.com/200x150',
        alt: 'Placeholder image',
        objectFit: 'cover',
        borderRadius: 0,
      },
    },
  },
  {
    type: 'button',
    label: 'Button',
    icon: '🔘',
    defaultProps: {
      type: 'button',
      position: { x: 0, y: 0 },
      size: { width: 120, height: 40 },
      properties: {
        text: 'Click me',
        variant: 'primary',
        size: 'md',
        disabled: false,
      },
    },
  },
];

const Palette: React.FC = () => {
  const { isMobile } = useAppSelector((state) => state.ui);

  const handleDragStart = (e: React.DragEvent, item: PaletteItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
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
      
      <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {paletteItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className={`
              bg-white border-2 border-gray-200 rounded-lg cursor-grab active:cursor-grabbing
              hover:border-blue-300 hover:shadow-md transition-all duration-200
              ${isMobile ? 'p-2' : 'p-3'}
            `}
          >
            <div className="flex items-center gap-2">
              <span className={`${isMobile ? 'text-lg' : 'text-2xl'}`}>
                {item.icon}
              </span>
              <div className="flex-1">
                <div className={`font-medium text-gray-800 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {item.label}
                </div>
                {!isMobile && (
                  <div className="text-xs text-gray-500">
                    {item.type}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!isMobile && (
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            💡 Tip: Drag components to the canvas to add them
          </div>
        </div>
      )}
    </div>
  );
};

export default Palette;
