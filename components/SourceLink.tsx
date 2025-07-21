
import React from 'react';
import { Web } from '../types';

interface SourceLinkProps {
    source: Web;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
    return (
        <a
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#292e42] p-3 rounded-lg hover:bg-[#414868] transition-colors duration-200 mb-2"
        >
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7aa2f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <div className="flex-grow overflow-hidden">
                    <p className="font-semibold text-[#c0caf5] truncate" title={source.title}>
                        {source.title || new URL(source.uri).hostname}
                    </p>
                    <p className="text-sm text-[#737aa2] truncate" title={source.uri}>
                        {source.uri}
                    </p>
                </div>
            </div>
        </a>
    );
};

export default SourceLink;
