import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SimpleMarkdownRendererProps {
  text: string;
}

const SimpleMarkdownRenderer: React.FC<SimpleMarkdownRendererProps> = ({ text }) => {
  // Debug: Let's see what we're actually getting
  console.log('=== DEBUGGING GEMINI OUTPUT ===');
  console.log('Raw text sample:', text.substring(0, 300));
  
  // Find all **text:** patterns
  const boldColonMatches = text.match(/\*\*[^*]+:\*\*/g);
  if (boldColonMatches) {
    console.log('Found **text:** patterns:', boldColonMatches);
  }

  let preprocessedText = text
    // Remove step headers
    .replace(/# (1단계|2단계):.*?(\n|$)/g, '')
    // Don't remove the ** markers - let ReactMarkdown handle them
    // Just clean up any malformed patterns
    .replace(/\*\*\s*\*\*/g, '') // Remove empty bold markers
    // Handle bullet points
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) return line;
      
      // Handle bullet points (but preserve ** markers)
      if (trimmedLine.match(/^[•*\-]\s/) && !trimmedLine.match(/^\* /)) {
        const indent = line.match(/^(\s*)/)?.[1] || '';
        const content = trimmedLine.replace(/^[•*\-]\s*/, '').trim();
        return content ? `${indent}* ${content}` : line;
      }
      
      return line;
    })
    .join('\n')
    .trim();

  console.log('Processed text sample:', preprocessedText.substring(0, 300));
  console.log('=== END DEBUG ===');

  return (
    <div className="prose prose-invert max-w-none text-[#c0caf5]">
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({node, ...props}: any) => <h1 className="text-2xl font-bold mt-6 mb-4 text-[#bb9af7]" {...props} />,
                h2: ({node, ...props}: any) => <h2 className="text-xl font-bold mt-5 mb-3 text-[#7dcfff]" {...props} />,
                h3: ({node, ...props}: any) => <h3 className="text-lg font-bold mt-4 mb-2 text-[#9ece6a]" {...props} />,
                h4: ({node, ...props}: any) => <h4 className="text-base font-bold mt-3 mb-1 text-[#a9b1d6]" {...props} />,
                h5: ({node, ...props}: any) => <h5 className="text-sm font-bold mt-2 mb-1 text-[#a9b1d6]" {...props} />,
                h6: ({node, ...props}: any) => <h6 className="text-xs font-bold mt-1 mb-1 text-[#a9b1d6]" {...props} />,
                p: ({node, ...props}: any) => <p className="my-1 leading-relaxed" {...props} />,
                strong: ({node, children, ...props}: any) => {
                    // Get the text content
                    const textContent = React.Children.toArray(children).join('');
                    console.log('Strong element content:', textContent);
                    
                    // If it ends with colon, make it a section header
                    if (textContent.endsWith(':')) {
                        return (
                            <strong className="font-bold text-[#bb9af7] block mt-4 mb-2 text-lg" {...props}>
                                {children}
                            </strong>
                        );
                    }
                    // Regular bold text
                    return <strong className="font-bold text-[#e0af68]" {...props}>{children}</strong>;
                },
                em: ({node, ...props}: any) => <em className="italic text-[#7aa2f7]" {...props} />,
                code: ({node, inline, ...props}: any) => 
                  <code className="text-[#e0af68] font-mono" {...props} />,
                ul: ({node, ...props}: any) => <ul className="my-2 pl-5 space-y-1" {...props} />,
                ol: ({node, ...props}: any) => <ol className="my-2 pl-5 space-y-1" {...props} />,
                li: ({node, ...props}: any) => <li className="my-0.5 ml-0" {...props} />,
                a: ({node, ...props}: any) => <a className="text-[#7aa2f7] hover:underline" {...props} />,
            }}
        >
            {preprocessedText}
        </ReactMarkdown>
    </div>
  );
};

export default SimpleMarkdownRenderer;
