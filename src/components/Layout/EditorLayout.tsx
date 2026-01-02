import React, { useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setMobileView } from '../../store/slices/uiSlice';
import Palette from '../Palette/Palette';
import Canvas from '../Canvas/Canvas';
import PropertiesPanel from '../Properties/PropertiesPanel';

const EditorLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leftPanelWidth, rightPanelWidth, isMobile, panelsCollapsed } = useAppSelector(
    (state) => state.ui
  );

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      dispatch(setMobileView(isMobileView));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const getLayoutStyles = () => {
    if (isMobile) {
      return {
        display: 'flex',
        flexDirection: 'column' as const,
        height: '100vh',
      };
    }

    const leftWidth = panelsCollapsed.left ? 0 : leftPanelWidth;
    const rightWidth = panelsCollapsed.right ? 0 : rightPanelWidth;
    const centerWidth = 100 - leftWidth - rightWidth;

    return {
      display: 'grid',
      gridTemplateColumns: `${leftWidth}% ${centerWidth}% ${rightWidth}%`,
      height: '100vh',
      overflow: 'hidden',
    };
  };

  const getMobileLayoutStyles = () => ({
    canvas: {
      flex: 1,
      minHeight: '60vh',
    },
    panels: {
      height: '40vh',
      display: 'flex',
      overflow: 'hidden',
    },
    panel: {
      flex: 1,
      borderRight: '1px solid #e5e7eb',
    },
  });

  if (isMobile) {
    const mobileStyles = getMobileLayoutStyles();
    
    return (
      <div style={getLayoutStyles()}>
        {/* Mobile Canvas */}
        <div style={mobileStyles.canvas}>
          <Canvas />
        </div>
        
        {/* Mobile Panels */}
        <div style={mobileStyles.panels}>
          <div style={mobileStyles.panel}>
            <Palette />
          </div>
          <div style={{ ...mobileStyles.panel, borderRight: 'none' }}>
            <PropertiesPanel />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={getLayoutStyles()}>
      {/* Left Panel - Palette */}
      {!panelsCollapsed.left && (
        <div className="border-r border-gray-300 bg-gray-50 overflow-hidden">
          <Palette />
        </div>
      )}
      
      {/* Center Panel - Canvas */}
      <div className="bg-white relative overflow-hidden">
        <Canvas />
      </div>
      
      {/* Right Panel - Properties */}
      {!panelsCollapsed.right && (
        <div className="border-l border-gray-300 bg-gray-50 overflow-hidden">
          <PropertiesPanel />
        </div>
      )}
    </div>
  );
};

export default EditorLayout;
