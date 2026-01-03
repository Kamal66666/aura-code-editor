import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import {
  selectComponent,
  updateComponent,
} from "../../store/slices/canvasSlice";
import ResizeHandles from "../ResizeHandles";
import HTMLPreview from "../HTMLPreview/HTMLPreview";
import type { EditorComponent } from "../../types/editor";

const Canvas: React.FC = () => {
  const dispatch = useAppDispatch();
  const { components, selectedComponentId, gridEnabled, zoom } = useAppSelector(
    (state) => state.canvas
  );
  const { isMobile } = useAppSelector((state) => state.ui);
  const { startCanvasDrag, setupGlobalListeners } = useDragAndDrop();
  const [editingComponentId, setEditingComponentId] = useState<string | null>(
    null
  );
  const [showHTMLPreview, setShowHTMLPreview] = useState(false);

  useEffect(() => {
    const cleanup = setupGlobalListeners();
    return cleanup;
  }, [setupGlobalListeners]);

  const getCanvasStyle = (): React.CSSProperties => ({
    width: "100%",
    height: "100%",
    position: "relative",
    background: gridEnabled
      ? `
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
        #fafafa
      `
      : "#fafafa",
    backgroundSize: gridEnabled ? "20px 20px" : "auto",
    transform: `scale(${zoom})`,
    transformOrigin: "top left",
    overflow: "hidden",
  });

  const handleComponentClick = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(selectComponent(componentId));
  };

  const handleDoubleClick = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingComponentId(componentId);
  };

  const handleContentChange = (
    componentId: string,
    property: string,
    value: any
  ) => {
    dispatch(
      updateComponent({
        id: componentId,
        updates: {
          properties: {
            ...components.find((c) => c.id === componentId)?.properties,
            [property]: value,
          },
        } as Partial<EditorComponent>,
      })
    );
  };

  const handleEditingComplete = () => {
    setEditingComponentId(null);
  };

  const handleResize = (
    componentId: string,
    direction: string,
    deltaX: number,
    deltaY: number
  ) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    let newWidth = component.size.width;
    let newHeight = component.size.height;
    let newX = component.position.x;
    let newY = component.position.y;

    // Calculate new dimensions based on resize direction
    switch (direction) {
      case 'n':
        newHeight = Math.max(20, component.size.height - deltaY);
        newY = component.position.y + (component.size.height - newHeight);
        break;
      case 's':
        newHeight = Math.max(20, component.size.height + deltaY);
        break;
      case 'w':
        newWidth = Math.max(20, component.size.width - deltaX);
        newX = component.position.x + (component.size.width - newWidth);
        break;
      case 'e':
        newWidth = Math.max(20, component.size.width + deltaX);
        break;
      case 'nw':
        newWidth = Math.max(20, component.size.width - deltaX);
        newHeight = Math.max(20, component.size.height - deltaY);
        newX = component.position.x + (component.size.width - newWidth);
        newY = component.position.y + (component.size.height - newHeight);
        break;
      case 'ne':
        newWidth = Math.max(20, component.size.width + deltaX);
        newHeight = Math.max(20, component.size.height - deltaY);
        newY = component.position.y + (component.size.height - newHeight);
        break;
      case 'sw':
        newWidth = Math.max(20, component.size.width - deltaX);
        newHeight = Math.max(20, component.size.height + deltaY);
        newX = component.position.x + (component.size.width - newWidth);
        break;
      case 'se':
        newWidth = Math.max(20, component.size.width + deltaX);
        newHeight = Math.max(20, component.size.height + deltaY);
        break;
    }

    // Update component size and position
    dispatch(updateComponent({
      id: componentId,
      updates: {
        size: { width: newWidth, height: newHeight },
        position: { x: newX, y: newY }
      }
    }));
  };


  const handleComponentMouseDown = (
    e: React.MouseEvent,
    component: EditorComponent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Select the component first
    dispatch(selectComponent(component.id));

    // Start drag operation
    startCanvasDrag(e, component);
  };

  const handleCanvasClick = () => {
    dispatch(selectComponent(null));
  };

  const renderComponent = (component: EditorComponent) => {
    const isSelected = component.id === selectedComponentId;

    const componentStyle: React.CSSProperties = {
      position: "absolute",
      left: component.position.x,
      top: component.position.y,
      width: component.size.width,
      height: component.size.height,
      border: isSelected ? "2px solid #3b82f6" : "1px solid transparent",
      borderRadius: "4px",
      cursor: "pointer",
      ...component.style,
    };

    const componentWrapper = (children: React.ReactNode) => (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {children}
        {isSelected && !editingComponentId && (
          <ResizeHandles
            onResize={(direction, deltaX, deltaY) =>
              handleResize(component.id, direction, deltaX, deltaY)
            }
          />
        )}
      </div>
    );

    switch (component.type) {
      case "text":
        const isEditing = editingComponentId === component.id;

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
              display: "flex",
              alignItems: "center",
              padding: "8px",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            onClick={(e) => handleComponentClick(component.id, e)}
            onDoubleClick={(e) => handleDoubleClick(component.id, e)}
            onMouseDown={(e) =>
              !isEditing && handleComponentMouseDown(e, component)
            }
          >
            {componentWrapper(
              isEditing ? (
                <input
                  type="text"
                  value={component.properties.content}
                  onChange={(e) =>
                    handleContentChange(component.id, "content", e.target.value)
                  }
                  onBlur={handleEditingComplete}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      handleEditingComplete();
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    color: "inherit",
                    textAlign: "inherit",
                    fontFamily: "inherit",
                  }}
                  autoFocus
                />
              ) : (
                <span>{component.properties.content}</span>
              )
            )}
          </div>
        );

      case "textarea":
        const isTextareaEditing = editingComponentId === component.id;

        return (
          <div
            key={component.id}
            style={componentStyle}
            onClick={(e) => handleComponentClick(component.id, e)}
            onDoubleClick={(e) => handleDoubleClick(component.id, e)}
            onMouseDown={(e) => !isTextareaEditing && handleComponentMouseDown(e, component)}
          >
            {componentWrapper(
              <textarea
                style={{
                  width: "100%",
                  height: "100%",
                  resize: "none",
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: component.properties.fontSize || 14,
                  color: component.properties.color || "#000000",
                  textAlign: component.properties.textAlign || "left",
                  fontFamily: "inherit",
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  outline: "none",
                }}
                placeholder={component.properties.placeholder}
                rows={component.properties.rows}
                cols={component.properties.cols}
                maxLength={component.properties.maxLength}
                readOnly={!isTextareaEditing}
                onChange={(e) =>
                  isTextareaEditing &&
                  handleContentChange(component.id, "value", e.target.value)
                }
                onBlur={() => isTextareaEditing && handleEditingComplete()}
                value={component.properties.value || ""}
              />
            )}
          </div>
        );

      case "image":
        return (
          <div
            key={component.id}
            style={componentStyle}
            onClick={(e) => handleComponentClick(component.id, e)}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
          >
            {componentWrapper(
              <img
                src={component.properties.src}
                alt={component.properties.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: component.properties.objectFit,
                  borderRadius: component.properties.borderRadius,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                }}
                draggable={false}
              />
            )}
          </div>
        );

      case "button":
        const isButtonEditing = editingComponentId === component.id;
        
        return (
          <div
            key={component.id}
            style={{
              ...componentStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => handleComponentClick(component.id, e)}
            onDoubleClick={(e) => handleDoubleClick(component.id, e)}
            onMouseDown={(e) => !isButtonEditing && handleComponentMouseDown(e, component)}
          >
            {componentWrapper(
              isButtonEditing ? (
                <input
                  type="text"
                  value={component.properties.text}
                  onChange={(e) =>
                    handleContentChange(component.id, "text", e.target.value)
                  }
                  onBlur={handleEditingComplete}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      handleEditingComplete();
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    width: "100%",
                    textAlign: "center",
                    fontSize: component.properties.fontSize || 16,
                    color: component.properties.textColor || "#ffffff",
                    fontWeight: "500",
                  }}
                  autoFocus
                />
              ) : (
                <button
                  style={{
                    width: "100%",
                    height: "100%",
                    fontSize: component.properties.fontSize || 16,
                    padding: component.properties.padding || 12,
                    backgroundColor: component.properties.backgroundColor || "#3b82f6",
                    color: component.properties.textColor || "#ffffff",
                    borderRadius: component.properties.borderRadius || 6,
                    border: "none",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                  }}
                  disabled={component.properties.disabled}
                >
                  {component.properties.text}
                </button>
              )
            )}
          </div>
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
          <h3
            className={`font-semibold text-gray-800 ${
              isMobile ? "text-sm" : "text-lg"
            }`}
          >
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
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              onClick={() => setShowHTMLPreview(true)}
            >
              Preview HTML
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              onClick={() => {
                /* TODO: Implement zoom controls */
              }}
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
          onClick={handleCanvasClick}
          data-canvas="true"
          className="min-h-full"
        >
          {components.map(renderComponent)}

          {/* Empty State */}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className={`${isMobile ? "text-4xl" : "text-6xl"} mb-4`}>
                  🎨
                </div>
                <div
                  className={`${
                    isMobile ? "text-sm" : "text-lg"
                  } font-medium mb-2`}
                >
                  Start Creating
                </div>
                <div className={`${isMobile ? "text-xs" : "text-sm"}`}>
                  Drag components from the palette to get started
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HTML Preview Modal */}
      <HTMLPreview
        isOpen={showHTMLPreview}
        onClose={() => setShowHTMLPreview(false)}
      />
    </div>
  );
};

export default Canvas;
