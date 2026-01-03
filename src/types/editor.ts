// Core Component Types
export interface BaseComponentProps {
  id: string;
  type: ComponentType;
  position: Position;
  size: Size;
  style?: React.CSSProperties;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// Component-Specific Properties
export interface TextComponentProps extends BaseComponentProps {
  type: 'text';
  properties: {
    content: string;
    fontSize: number;
    fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    fontFamily: string;
  };
}

export interface TextAreaComponentProps extends BaseComponentProps {
  type: 'textarea';
  properties: {
    placeholder: string;
    rows: number;
    cols: number;
    maxLength?: number;
    resize: 'none' | 'both' | 'horizontal' | 'vertical';
    fontSize?: number;
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    value?: string;
  };
}

export interface ImageComponentProps extends BaseComponentProps {
  type: 'image';
  properties: {
    src: string;
    alt: string;
    objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    borderRadius: number;
  };
}

export interface ButtonComponentProps extends BaseComponentProps {
  type: 'button';
  properties: {
    text: string;
    variant: 'primary' | 'secondary' | 'outline' | 'ghost';
    size: 'sm' | 'md' | 'lg';
    disabled: boolean;
    onClick?: string; // JavaScript code as string
    url?: string;
    fontSize?: number;
    padding?: number;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
  };
}

export type ComponentType = 'text' | 'textarea' | 'image' | 'button';
export type EditorComponent = TextComponentProps | TextAreaComponentProps | ImageComponentProps | ButtonComponentProps;

// Canvas State
export interface CanvasState {
  components: EditorComponent[];
  selectedComponentId: string | null;
  canvasSize: Size;
  zoom: number;
  gridEnabled: boolean;
  snapToGrid: boolean;
}

// Drag and Drop State
export interface DragState {
  isDragging: boolean;
  draggedComponent: ComponentType | null;
  draggedComponentId: string | null;
  dragOffset: Position;
  dropZone: 'canvas' | 'palette' | null;
}

// UI State
export interface UIState {
  leftPanelWidth: number;
  rightPanelWidth: number;
  showGrid: boolean;
  showRulers: boolean;
  isMobile: boolean;
  panelsCollapsed: {
    left: boolean;
    right: boolean;
  };
}

// Component Palette Item
export interface PaletteItem {
  type: ComponentType;
  label: string;
  icon: string;
  defaultProps: Partial<EditorComponent>;
}

// History State
export interface HistoryState {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
}
