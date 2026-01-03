import React from 'react';

interface ResizeHandlesProps {
  onResize: (direction: string, deltaX: number, deltaY: number) => void;
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResize }) => {
  const handleMouseDown = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      onResize(direction, deltaX, deltaY);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: '#3b82f6',
    border: '1px solid #ffffff',
    borderRadius: '2px',
    cursor: 'pointer',
    zIndex: 10,
  };

  return (
    <>
      {/* Corner handles */}
      <div
        style={{
          ...handleStyle,
          width: '8px',
          height: '8px',
          top: '-4px',
          left: '-4px',
          cursor: 'nw-resize',
        }}
        onMouseDown={handleMouseDown('nw')}
      />
      <div
        style={{
          ...handleStyle,
          width: '8px',
          height: '8px',
          top: '-4px',
          right: '-4px',
          cursor: 'ne-resize',
        }}
        onMouseDown={handleMouseDown('ne')}
      />
      <div
        style={{
          ...handleStyle,
          width: '8px',
          height: '8px',
          bottom: '-4px',
          left: '-4px',
          cursor: 'sw-resize',
        }}
        onMouseDown={handleMouseDown('sw')}
      />
      <div
        style={{
          ...handleStyle,
          width: '8px',
          height: '8px',
          bottom: '-4px',
          right: '-4px',
          cursor: 'se-resize',
        }}
        onMouseDown={handleMouseDown('se')}
      />
      
      {/* Edge handles */}
      <div
        style={{
          ...handleStyle,
          width: '8px',
          height: '20px',
          top: '50%',
          left: '-4px',
          transform: 'translateY(-50%)',
          cursor: 'w-resize',
        }}
        onMouseDown={handleMouseDown('w')}
      />
      <div
        style={{
          ...handleStyle,
          width: '8px',
          height: '20px',
          top: '50%',
          right: '-4px',
          transform: 'translateY(-50%)',
          cursor: 'e-resize',
        }}
        onMouseDown={handleMouseDown('e')}
      />
      <div
        style={{
          ...handleStyle,
          width: '20px',
          height: '8px',
          top: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'n-resize',
        }}
        onMouseDown={handleMouseDown('n')}
      />
      <div
        style={{
          ...handleStyle,
          width: '20px',
          height: '8px',
          bottom: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 's-resize',
        }}
        onMouseDown={handleMouseDown('s')}
      />
    </>
  );
};

export default ResizeHandles;
