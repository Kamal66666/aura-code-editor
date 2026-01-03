import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  selectComponent,
  updateComponent,
} from "../../store/slices/canvasSlice";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
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
            {isEditing ? (
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
              component.properties.content
            )}
          </div>
        );

      case "textarea":
        const isTextareaEditing = editingComponentId === component.id;

        return (
          <textarea
            key={component.id}
            style={{
              ...componentStyle,
              resize: component.properties.resize,
              padding: "8px",
              border: isSelected ? "2px solid #3b82f6" : "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: component.properties.fontSize || 14,
              color: component.properties.color || "#000000",
              textAlign: component.properties.textAlign || "left",
              fontFamily: "inherit",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            placeholder={component.properties.placeholder}
            rows={component.properties.rows}
            cols={component.properties.cols}
            maxLength={component.properties.maxLength}
            readOnly={!isTextareaEditing}
            onClick={(e) => handleComponentClick(component.id, e)}
            onDoubleClick={(e) => handleDoubleClick(component.id, e)}
            onMouseDown={(e) =>
              !isTextareaEditing && handleComponentMouseDown(e, component)
            }
            onChange={(e) =>
              isTextareaEditing &&
              handleContentChange(component.id, "value", e.target.value)
            }
            onBlur={() => isTextareaEditing && handleEditingComplete()}
            value={component.properties.value || ""}
          />
        );

      case "image":
        return (
          <img
            key={component.id}
            src={component.properties.src}
            alt={component.properties.alt}
            style={{
              ...componentStyle,
              objectFit: component.properties.objectFit,
              borderRadius: component.properties.borderRadius,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              backgroundColor: "#f8f9fa",
              border: isSelected ? "2px solid #3b82f6" : "1px solid #e9ecef",
            }}
            onClick={(e) => handleComponentClick(component.id, e)}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
            draggable={false}
          />
        );

      case "button":
        return (
          <button
            key={component.id}
            style={{
              ...componentStyle,
              fontSize: component.properties.fontSize || 16,
              padding: component.properties.padding || 12,
              backgroundColor:
                component.properties.backgroundColor || "#3b82f6",
              color: component.properties.textColor || "#ffffff",
              borderRadius: component.properties.borderRadius || 6,
              border: isSelected ? "2px solid #3b82f6" : "none",
              fontWeight: "500",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            disabled={component.properties.disabled}
            onClick={(e) => handleComponentClick(component.id, e)}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
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
    </div>
  );
};

export default Canvas;
