import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateComponent } from '../../store/slices/canvasSlice';
import type { EditorComponent } from '../../types/editor';

const PropertiesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { components, selectedComponentId } = useAppSelector((state) => state.canvas);
  const { isMobile } = useAppSelector((state) => state.ui);

  const selectedComponent = components.find(comp => comp.id === selectedComponentId);

  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedComponentId || !selectedComponent) return;
    
    dispatch(updateComponent({
      id: selectedComponentId,
      updates: {
        properties: {
          ...selectedComponent.properties,
          [property]: value,
        },
      } as Partial<EditorComponent>,
    }));
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (!selectedComponentId || !selectedComponent) return;
    
    dispatch(updateComponent({
      id: selectedComponentId,
      updates: {
        position: {
          ...selectedComponent.position,
          [axis]: value,
        },
      },
    }));
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (!selectedComponentId || !selectedComponent) return;
    
    dispatch(updateComponent({
      id: selectedComponentId,
      updates: {
        size: {
          ...selectedComponent.size,
          [dimension]: value,
        },
      },
    }));
  };

  const renderTextProperties = (component: EditorComponent) => {
    if (component.type !== 'text') return null;
    
    return (
      <div className="space-y-4">
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Content
          </label>
          <textarea
            value={component.properties.content}
            onChange={(e) => handlePropertyChange('content', e.target.value)}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
            rows={3}
          />
        </div>
        
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Font Size
          </label>
          <input
            type="number"
            value={component.properties.fontSize}
            onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
            min="8"
            max="72"
          />
        </div>
        
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Color
          </label>
          <input
            type="color"
            value={component.properties.color}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
          />
        </div>
        
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Text Align
          </label>
          <select
            value={component.properties.textAlign}
            onChange={(e) => handlePropertyChange('textAlign', e.target.value)}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
      </div>
    );
  };

  const renderButtonProperties = (component: EditorComponent) => {
    if (component.type !== 'button') return null;
    
    return (
      <div className="space-y-4">
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Button Text
          </label>
          <input
            type="text"
            value={component.properties.text}
            onChange={(e) => handlePropertyChange('text', e.target.value)}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
          />
        </div>
        
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Variant
          </label>
          <select
            value={component.properties.variant}
            onChange={(e) => handlePropertyChange('variant', e.target.value)}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Size
          </label>
          <select
            value={component.properties.size}
            onChange={(e) => handlePropertyChange('size', e.target.value)}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="disabled"
            checked={component.properties.disabled}
            onChange={(e) => handlePropertyChange('disabled', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="disabled" className={`text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Disabled
          </label>
        </div>
      </div>
    );
  };

  const renderImageProperties = (component: EditorComponent) => {
    if (component.type !== 'image') return null;
    
    return (
      <div className="space-y-4">
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Image URL
          </label>
          <input
            type="url"
            value={component.properties.src}
            onChange={(e) => handlePropertyChange('src', e.target.value)}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Alt Text
          </label>
          <input
            type="text"
            value={component.properties.alt}
            onChange={(e) => handlePropertyChange('alt', e.target.value)}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
          />
        </div>
        
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Object Fit
          </label>
          <select
            value={component.properties.objectFit}
            onChange={(e) => handlePropertyChange('objectFit', e.target.value)}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
          >
            <option value="contain">Contain</option>
            <option value="cover">Cover</option>
            <option value="fill">Fill</option>
            <option value="none">None</option>
            <option value="scale-down">Scale Down</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Border Radius
          </label>
          <input
            type="number"
            value={component.properties.borderRadius}
            onChange={(e) => handlePropertyChange('borderRadius', parseInt(e.target.value))}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
            min="0"
            max="50"
          />
        </div>
      </div>
    );
  };

  const renderTextAreaProperties = (component: EditorComponent) => {
    if (component.type !== 'textarea') return null;
    
    return (
      <div className="space-y-4">
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Placeholder
          </label>
          <input
            type="text"
            value={component.properties.placeholder}
            onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
          />
        </div>
        
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Rows
          </label>
          <input
            type="number"
            value={component.properties.rows}
            onChange={(e) => handlePropertyChange('rows', parseInt(e.target.value))}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
            min="1"
            max="20"
          />
        </div>
        
        <div>
          <label className={`block text-gray-700 font-medium mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Resize
          </label>
          <select
            value={component.properties.resize}
            onChange={(e) => handlePropertyChange('resize', e.target.value)}
            className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? 'text-xs' : 'text-sm'}`}
          >
            <option value="none">None</option>
            <option value="both">Both</option>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col ${isMobile ? 'p-2' : 'p-4'}`}>
      <div className="mb-4">
        <h2 className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : 'text-lg'}`}>
          Properties
        </h2>
        <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {selectedComponent ? 'Edit component' : 'Select a component'}
        </p>
      </div>

      {selectedComponent ? (
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Position & Size */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className={`font-medium text-gray-800 mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Position & Size
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-gray-600 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>X</label>
                <input
                  type="number"
                  value={Math.round(selectedComponent.position.x)}
                  onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                  className={`w-full border border-gray-300 rounded px-2 py-1 ${isMobile ? 'text-xs' : 'text-sm'}`}
                />
              </div>
              <div>
                <label className={`block text-gray-600 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>Y</label>
                <input
                  type="number"
                  value={Math.round(selectedComponent.position.y)}
                  onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                  className={`w-full border border-gray-300 rounded px-2 py-1 ${isMobile ? 'text-xs' : 'text-sm'}`}
                />
              </div>
              <div>
                <label className={`block text-gray-600 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>Width</label>
                <input
                  type="number"
                  value={selectedComponent.size.width}
                  onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 0)}
                  className={`w-full border border-gray-300 rounded px-2 py-1 ${isMobile ? 'text-xs' : 'text-sm'}`}
                />
              </div>
              <div>
                <label className={`block text-gray-600 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>Height</label>
                <input
                  type="number"
                  value={selectedComponent.size.height}
                  onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 0)}
                  className={`w-full border border-gray-300 rounded px-2 py-1 ${isMobile ? 'text-xs' : 'text-sm'}`}
                />
              </div>
            </div>
          </div>

          {/* Component-specific properties */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className={`font-medium text-gray-800 mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} Properties
            </h3>
            
            {renderTextProperties(selectedComponent)}
            {renderButtonProperties(selectedComponent)}
            {renderImageProperties(selectedComponent)}
            {renderTextAreaProperties(selectedComponent)}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className={`${isMobile ? 'text-3xl' : 'text-5xl'} mb-3`}>⚙️</div>
            <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
              Select a component to edit its properties
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
