import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateComponent } from '../../store/slices/canvasSlice';
import NumberSlider from '../Controls/NumberSlider';
import ColorPicker from '../Controls/ColorPicker';
import Dropdown from '../Controls/Dropdown';
import ButtonGroup from '../Controls/ButtonGroup';
import TextInput from '../Controls/TextInput';
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
        <TextInput
          label="Content"
          value={component.properties.content}
          onChange={(value) => handlePropertyChange('content', value)}
          multiline
          rows={3}
        />
        
        <NumberSlider
          label="Font Size"
          value={component.properties.fontSize}
          onChange={(value) => handlePropertyChange('fontSize', value)}
          min={8}
          max={72}
          unit="px"
        />
        
        <ColorPicker
          label="Color"
          value={component.properties.color}
          onChange={(value) => handlePropertyChange('color', value)}
        />
        
        <Dropdown
          label="Font Weight"
          value={component.properties.fontWeight || 'normal'}
          onChange={(value) => handlePropertyChange('fontWeight', value)}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'bold', label: 'Bold' },
            { value: '100', label: 'Thin' },
            { value: '300', label: 'Light' },
            { value: '500', label: 'Medium' },
            { value: '600', label: 'Semi Bold' },
            { value: '700', label: 'Bold' },
            { value: '900', label: 'Black' },
          ]}
        />
      </div>
    );
  };

  const renderButtonProperties = (component: EditorComponent) => {
    if (component.type !== 'button') return null;
    
    return (
      <div className="space-y-4">
        <TextInput
          label="Button Text"
          value={component.properties.text}
          onChange={(value) => handlePropertyChange('text', value)}
        />
        
        <TextInput
          label="URL"
          value={component.properties.url || ''}
          onChange={(value) => handlePropertyChange('url', value)}
          type="url"
          placeholder="https://example.com"
        />
        
        <NumberSlider
          label="Font Size"
          value={component.properties.fontSize || 16}
          onChange={(value) => handlePropertyChange('fontSize', value)}
          min={8}
          max={32}
          unit="px"
        />
        
        <NumberSlider
          label="Padding"
          value={component.properties.padding || 12}
          onChange={(value) => handlePropertyChange('padding', value)}
          min={0}
          max={50}
          unit="px"
        />
        
        <ColorPicker
          label="Background Color"
          value={component.properties.backgroundColor || '#3b82f6'}
          onChange={(value) => handlePropertyChange('backgroundColor', value)}
        />
        
        <ColorPicker
          label="Text Color"
          value={component.properties.textColor || '#ffffff'}
          onChange={(value) => handlePropertyChange('textColor', value)}
        />
        
        <NumberSlider
          label="Border Radius"
          value={component.properties.borderRadius || 6}
          onChange={(value) => handlePropertyChange('borderRadius', value)}
          min={0}
          max={50}
          unit="px"
        />
      </div>
    );
  };

  const renderImageProperties = (component: EditorComponent) => {
    if (component.type !== 'image') return null;
    
    return (
      <div className="space-y-4">
        <TextInput
          label="Image URL"
          value={component.properties.src}
          onChange={(value) => handlePropertyChange('src', value)}
          type="url"
          placeholder="https://example.com/image.jpg"
        />
        
        <TextInput
          label="Alt Text"
          value={component.properties.alt}
          onChange={(value) => handlePropertyChange('alt', value)}
          placeholder="Describe the image"
        />
        
        <Dropdown
          label="Object Fit"
          value={component.properties.objectFit}
          onChange={(value) => handlePropertyChange('objectFit', value)}
          options={[
            { value: 'contain', label: 'Contain' },
            { value: 'cover', label: 'Cover' },
            { value: 'fill', label: 'Fill' },
            { value: 'none', label: 'None' },
            { value: 'scale-down', label: 'Scale Down' },
          ]}
        />
        
        <NumberSlider
          label="Border Radius"
          value={component.properties.borderRadius}
          onChange={(value) => handlePropertyChange('borderRadius', value)}
          min={0}
          max={50}
          unit="px"
        />
        
        <NumberSlider
          label="Height"
          value={component.size.height}
          onChange={(value) => handleSizeChange('height', value)}
          min={50}
          max={800}
          unit="px"
        />
        
        <NumberSlider
          label="Width"
          value={component.size.width}
          onChange={(value) => handleSizeChange('width', value)}
          min={50}
          max={800}
          unit="px"
        />
      </div>
    );
  };

  const renderTextAreaProperties = (component: EditorComponent) => {
    if (component.type !== 'textarea') return null;
    
    return (
      <div className="space-y-4">
        <TextInput
          label="Placeholder"
          value={component.properties.placeholder}
          onChange={(value) => handlePropertyChange('placeholder', value)}
          placeholder="Enter placeholder text"
        />
        
        <NumberSlider
          label="Font Size"
          value={component.properties.fontSize || 14}
          onChange={(value) => handlePropertyChange('fontSize', value)}
          min={8}
          max={32}
          unit="px"
        />
        
        <ColorPicker
          label="Text Color"
          value={component.properties.color || '#000000'}
          onChange={(value) => handlePropertyChange('color', value)}
        />
        
        <ButtonGroup
          label="Text Align"
          value={component.properties.textAlign || 'left'}
          onChange={(value) => handlePropertyChange('textAlign', value)}
          options={[
            { value: 'left', label: 'Left', icon: '⬅️' },
            { value: 'center', label: 'Center', icon: '↔️' },
            { value: 'right', label: 'Right', icon: '➡️' },
          ]}
        />
        
        <NumberSlider
          label="Rows"
          value={component.properties.rows}
          onChange={(value) => handlePropertyChange('rows', value)}
          min={1}
          max={20}
        />
      </div>
    );
  };

  if (!selectedComponent) {
    return (
      <div className={`bg-white border-l border-gray-200 ${`w-full`} p-4`}>
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-gray-500">No selection</p>
          <p className="text-sm text-gray-400 mt-1">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-l border-gray-200 ${isMobile ? 'w-full' : 'w-80'} h-full flex flex-col`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        <p className="text-sm text-gray-600">
          {selectedComponent?.type.charAt(0).toUpperCase() + selectedComponent?.type.slice(1)} Settings
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {/* Position & Size */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 text-sm">Position & Size</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <NumberSlider
              label="X Position"
              value={Math.round(selectedComponent.position.x)}
              onChange={(value) => handlePositionChange('x', value)}
              min={0}
              max={1000}
              unit="px"
            />
            <NumberSlider
              label="Y Position"
              value={Math.round(selectedComponent.position.y)}
              onChange={(value) => handlePositionChange('y', value)}
              min={0}
              max={1000}
              unit="px"
            />
            <NumberSlider
              label="Width"
              value={selectedComponent.size.width}
              onChange={(value) => handleSizeChange('width', value)}
              min={50}
              max={800}
              unit="px"
            />
            <NumberSlider
              label="Height"
              value={selectedComponent.size.height}
              onChange={(value) => handleSizeChange('height', value)}
              min={20}
              max={600}
              unit="px"
            />
          </div>
        </div>

        {/* Component-specific properties */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 text-sm">
            {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} Properties
          </h3>
          
          {renderTextProperties(selectedComponent)}
          {renderButtonProperties(selectedComponent)}
          {renderImageProperties(selectedComponent)}
          {renderTextAreaProperties(selectedComponent)}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
