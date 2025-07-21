
import React from 'react';

interface SimpleMarkdownRendererProps {
  text: string;
}

const SimpleMarkdownRenderer: React.FC<SimpleMarkdownRendererProps> = ({ text }) => {
  const renderMarkdown = (markdownText: string) => {
    const blocks = markdownText.split(/(\n\n+)/);

    return blocks.map((block, index) => {
      if (block.trim() === '') return null;

      // Headers
      if (block.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-[#bb9af7]">{block.substring(2)}</h1>;
      if (block.startsWith('## ')) return <h2 key={index} className="text-xl font-bold mt-5 mb-3 text-[#7dcfff]">{block.substring(3)}</h2>;
      if (block.startsWith('### ')) return <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-[#9ece6a]">{block.substring(4)}</h3>;

      // Unordered Lists
      if (block.startsWith('* ')) {
        const items = block.split('\n').filter(item => item.startsWith('* '));
        return (
          <ul key={index} className="list-disc list-inside space-y-1 my-2">
            {items.map((item, i) => <li key={i}>{renderInline(item.substring(2))}</li>)}
          </ul>
        );
      }
      
      // Ordered Lists
      if (block.match(/^\d+\. /)) {
        const items = block.split('\n').filter(item => item.match(/^\d+\. /));
        return (
          <ol key={index} className="list-decimal list-inside space-y-1 my-2">
            {items.map((item, i) => <li key={i}>{renderInline(item.replace(/^\d+\. /, ''))}</li>)}
          </ol>
        );
      }

      // Default to paragraph
      return <p key={index} className="my-3 leading-relaxed">{renderInline(block)}</p>;
    });
  };

  const renderInline = (inlineText: string) => {
    const parts = inlineText.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-[#1e2030] text-[#e0af68] px-1.5 py-1 rounded-md text-sm font-mono">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const cleanedText = text.replace(/# (1단계|2단계):.*?(\n|$)/g, '');

  return <div className="prose-invert text-[#c0caf5]">{renderMarkdown(cleanedText)}</div>;
};

export default SimpleMarkdownRenderer;
