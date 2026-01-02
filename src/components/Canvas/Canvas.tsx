import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addComponent, selectComponent } from '../../store/slices/canvasSlice';
import type { PaletteItem, EditorComponent } from '../../types/editor';

const Canvas: React.FC = () => {
  const dispatch = useAppDispatch();
  const { components, selectedComponentId, gridEnabled, zoom } = useAppSelector(
    (state) => state.canvas
  );
  const { isMobile } = useAppSelector((state) => state.ui);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const paletteItem: PaletteItem = JSON.parse(
        e.dataTransfer.getData('application/json')
      );
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      
      const newComponent: EditorComponent = {
        ...paletteItem.defaultProps,
        id: `${paletteItem.type}-${Date.now()}`,
        position: { x, y },
      } as EditorComponent;
      
      dispatch(addComponent(newComponent));
    } catch (error) {
      console.error('Failed to parse dropped item:', error);
    }
  };

  const getCanvasStyle = (): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    background: gridEnabled
      ? `
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
        #fafafa
      `
      : '#fafafa',
    backgroundSize: gridEnabled ? '20px 20px' : 'auto',
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    overflow: 'hidden',
  });

  const handleComponentClick = (componentId: string) => {
    dispatch(selectComponent(componentId));
  };

  const renderComponent = (component: EditorComponent) => {
    const isSelected = component.id === selectedComponentId;
    
    const componentStyle: React.CSSProperties = {
      position: 'absolute',
      left: component.position.x,
      top: component.position.y,
      width: component.size.width,
      height: component.size.height,
      border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
      borderRadius: '4px',
      cursor: 'pointer',
      ...component.style,
    };

    switch (component.type) {
      case 'text':
        return (
          <div
            key={component.id}
            style={{
              ...componentStyle,
              fontSize: component.properties.fontSize,
              fontWeight: component.properties.fontWeight,
              color: component.properties.color,
              textAlign: component.properties.textAlign,
              fontFamily: component.properties.fontFamily,
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
            onClick={() => handleComponentClick(component.id)}
          >
            {component.properties.content}
          </div>
        );
        
      case 'textarea':
        return (
          <textarea
            key={component.id}
            style={{
              ...componentStyle,
              resize: component.properties.resize,
              padding: '8px',
              border: isSelected ? '2px solid #3b82f6' : '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
            placeholder={component.properties.placeholder}
            rows={component.properties.rows}
            cols={component.properties.cols}
            maxLength={component.properties.maxLength}
            readOnly
            onClick={() => handleComponentClick(component.id)}
          />
        );
        
      case 'image':
        return (
          <img
            key={component.id}
            src={component.properties.src}
            alt={component.properties.alt}
            style={{
              ...componentStyle,
              objectFit: component.properties.objectFit,
              borderRadius: component.properties.borderRadius,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
            onClick={() => handleComponentClick(component.id)}
          />
        );
        
      case 'button':
        const buttonVariants = {
          primary: 'bg-blue-600 text-white hover:bg-blue-700',
          secondary: 'bg-gray-600 text-white hover:bg-gray-700',
          outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
          ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
        };
        
        const buttonSizes = {
          sm: 'px-3 py-1 text-sm',
          md: 'px-4 py-2 text-base',
          lg: 'px-6 py-3 text-lg',
        };
        
        return (
          <button
            key={component.id}
            style={componentStyle}
            className={`
              ${buttonVariants[component.properties.variant]}
              ${buttonSizes[component.properties.size]}
              rounded font-medium transition-colors duration-200
              ${component.properties.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={component.properties.disabled}
            onClick={() => handleComponentClick(component.id)}
          >
            {component.properties.text}
          </button>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : 'text-lg'}`}>
            Canvas
          </h3>
          {!isMobile && (
            <div className="text-sm text-gray-600">
              Zoom: {Math.round(zoom * 100)}%
            </div>
          )}
        </div>
        
        {!isMobile && (
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              onClick={() => {/* TODO: Implement zoom controls */}}
            >
              Fit to Screen
            </button>
          </div>
        )}
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 overflow-auto">
        <div
          style={getCanvasStyle()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="min-h-full"
        >
          {components.map(renderComponent)}
          
          {/* Empty State */}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className={`${isMobile ? 'text-4xl' : 'text-6xl'} mb-4`}>
                  🎨
                </div>
                <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-medium mb-2`}>
                  Start Creating
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Drag components from the palette to get started
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
