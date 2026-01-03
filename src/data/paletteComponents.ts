import type { PaletteItem } from '../types/editor';

export const paletteComponents: PaletteItem[] = [
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
        src: 'https://via.placeholder.com/200x150/cccccc/666666?text=Image',
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
