
import React from 'react';

interface SimpleMarkdownRendererProps {
  text: string;
}

const SimpleMarkdownRenderer: React.FC<SimpleMarkdownRendererProps> = ({ text }) => {
  const renderLine = (line: string, index: number) => {
    if (line.startsWith('# 1단계') || line.startsWith('# 2단계')) {
       return null; // Hide the prompt headers from the response
    }
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-[#9ece6a]">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-[#7dcfff]">{line.substring(3)}</h2>;
    }
    if (line.startsWith('* ')) {
       // Check for nested list item
       const isNested = line.trim().startsWith('*');
       return <li key={index} className={`list-disc ${isNested ? 'ml-10' : 'ml-5'}`}>{line.substring(line.indexOf('* ') + 2)}</li>;
    }

    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);

    return (
      <p key={index} className="my-2 leading-relaxed">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className="bg-[#1e2030] text-[#e0af68] px-1 py-0.5 rounded text-sm">{part.slice(1, -1)}</code>;
          }
          return part;
        })}
      </p>
    );
  };
  
  // Normalize line breaks and filter out empty lines for cleaner rendering
  const lines = text.replace(/\\n/g, '\n').split('\n').filter(line => line.trim() !== '');

  return <div className="prose-invert text-[#c0caf5]">{lines.map(renderLine)}</div>;
};

export default SimpleMarkdownRenderer;
