
import React from 'react';
import Spinner from './Spinner';
import SimpleMarkdownRenderer from './SimpleMarkdownRenderer';

interface ResultCardProps {
    title: string;
    icon: React.ReactNode;
    content: string;
    isLoading: boolean;
    children?: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, content, isLoading, children }) => {
    return (
        <div className="bg-[#24283b] rounded-lg shadow-2xl flex flex-col h-full">
            <div className="border-b-2 border-[#414868] p-4 flex items-center gap-3">
                {icon}
                <h2 className="text-2xl font-bold text-[#bb9af7]">{title}</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-grow" style={{ maxHeight: '70vh' }}>
                {isLoading && !content && <Spinner />}
                <SimpleMarkdownRenderer text={content} />
                {isLoading && content && <div className="animate-pulse h-4 w-1/4 bg-[#414868] rounded mt-4"></div>}
                {children}
            </div>
        </div>
    );
};

export default ResultCard;
