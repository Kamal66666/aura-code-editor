import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';

interface HTMLPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const HTMLPreview: React.FC<HTMLPreviewProps> = ({ isOpen, onClose }) => {
  const { components } = useAppSelector((state) => state.canvas);
  const [copied, setCopied] = useState(false);

  const generateHTML = (): string => {
    const sortedComponents = [...components].sort((a, b) => a.position.y - b.position.y);
    
    const componentHTML = sortedComponents.map((component) => {
      const style = `
        position: absolute;
        left: ${component.position.x}px;
        top: ${component.position.y}px;
        width: ${component.size.width}px;
        height: ${component.size.height}px;
      `.trim();

      switch (component.type) {
        case 'text':
          return `    <div style="${style} font-size: ${component.properties.fontSize || 16}px; color: ${component.properties.color || '#000000'}; font-weight: ${component.properties.fontWeight || 'normal'}; text-align: ${component.properties.textAlign || 'left'}; display: flex; align-items: center;">
      ${component.properties.content || 'Text'}
    </div>`;

        case 'textarea':
          return `    <textarea style="${style} padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: ${component.properties.fontSize || 14}px; color: ${component.properties.color || '#000000'}; text-align: ${component.properties.textAlign || 'left'}; background-color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); resize: none;" placeholder="${component.properties.placeholder || ''}" ${component.properties.maxLength ? `maxlength="${component.properties.maxLength}"` : ''}>${component.properties.value || ''}</textarea>`;

        case 'button':
          return `    <button style="${style} font-size: ${component.properties.fontSize || 16}px; padding: ${component.properties.padding || 12}px; background-color: ${component.properties.backgroundColor || '#3b82f6'}; color: ${component.properties.textColor || '#ffffff'}; border-radius: ${component.properties.borderRadius || 6}px; border: none; font-weight: 500; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.1); cursor: pointer;" ${component.properties.disabled ? 'disabled' : ''}>
      ${component.properties.text || 'Button'}
    </button>`;

        case 'image':
          return `    <img src="${component.properties.src || ''}" alt="${component.properties.alt || ''}" style="${style} object-fit: ${component.properties.objectFit || 'cover'}; border-radius: ${component.properties.borderRadius || 0}px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); background-color: #f8f9fa; border: 1px solid #e9ecef;" />`;

        default:
          return '';
      }
    }).filter(Boolean).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Layout</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background-color: #f8f9fa;
        }
        .container {
            position: relative;
            background-color: white;
            min-height: 600px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div class="container">
${componentHTML}
    </div>
</body>
</html>`;
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(generateHTML());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy HTML:', err);
    }
  };

  if (!isOpen) return null;

  const htmlContent = generateHTML();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">HTML Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copied ? 'Copied!' : 'Copy HTML'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Preview Panel */}
          <div className="flex-1 p-4 overflow-auto">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Live Preview</h3>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <iframe
                srcDoc={htmlContent}
                className="w-full h-96 border-0"
                title="HTML Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>

          {/* Code Panel */}
          <div className="flex-1 p-4 border-l overflow-auto">
            <h3 className="text-lg font-medium text-gray-800 mb-3">HTML Code</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto h-96 font-mono">
              <code>{htmlContent}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLPreview;
