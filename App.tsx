import React, { useState, useCallback, useEffect } from 'react';
import { getInternalKnowledgeStream, getVerifiedKnowledgeStream } from './services/geminiService';
import { GroundingChunk, AppStatus } from './types';

import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import SourceLink from './components/SourceLink';

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#9ece6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-2.586a1 1 0 01.293-.707l5.964-5.964A1 1 0 0018.95 4H14.5a2 2 0 00-2 2v2.5a.5.5 0 01-1 0V6a4 4 0 014-4h4.5a1 1 0 01.707.293l-6.646 6.646a2 2 0 000 2.828l6.646 6.646a1 1 0 01-.707.293H16.5a4 4 0 01-4-4v-2.5a.5.5 0 011 0V14a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#7aa2f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l-2.5 2.5M10 10l2.5-2.5M10 10l2.5 2.5M10 10l-2.5-2.5" />
        <path d="M13.293 7.293L8.5 12.086" />
    </svg>
);

function App() {
    const [apiKey, setApiKey] = useState<string>('');
    const [model, setModel] = useState<string>('gemini-2.5-flash');
    const [userInput, setUserInput] = useState<string>('');
    const [testTitle, setTestTitle] = useState<string>('');
    const [status, setStatus] = useState<AppStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const [step1Result, setStep1Result] = useState<string>('');
    const [step2Result, setStep2Result] = useState<string>('');
    const [searchResults, setSearchResults] = useState<GroundingChunk[]>([]);

    useEffect(() => {
        const storedApiKey = localStorage.getItem('gemini-api-key');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem('gemini-api-key', apiKey);
        }
    }, [apiKey]);

    const resetState = useCallback(() => {
        setUserInput('');
        setTestTitle('');
        setStatus('idle');
        setError(null);
        setStep1Result('');
        setStep2Result('');
        setSearchResults([]);
    }, []);
    
    const handleStartTest = useCallback(async () => {
        if (!userInput.trim() || !apiKey || status !== 'idle') return;

        resetState();
        setTestTitle(userInput);
        setStatus('step1_generating');
        setError(null);

        try {
            // Step 1: Internal Knowledge
            const step1Stream = await getInternalKnowledgeStream(apiKey, userInput, model);
            let step1FullResult = '';
            for await (const chunk of step1Stream) {
                const text = chunk.text;
                step1FullResult += text;
                setStep1Result(prev => prev + text);
            }

            // Step 2: Web Verification
            setStatus('step2_generating');
            const step2Stream = await getVerifiedKnowledgeStream(apiKey, userInput, step1FullResult, model);
            for await (const chunk of step2Stream) {
                setStep2Result(prev => prev + chunk.text);
                const newChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
                if (newChunks.length > 0) {
                    setSearchResults(prev => {
                        const existingUris = new Set(prev.map(c => c.web.uri));
                        const uniqueNewChunks = newChunks.filter(
                            c => c.web && c.web.uri && !existingUris.has(c.web.uri)
                        );
                        if (uniqueNewChunks.length === 0) return prev;
                        const mappedChunks: GroundingChunk[] = uniqueNewChunks.map(c => ({
                            web: {
                                uri: c.web!.uri!,
                                title: c.web!.title || '',
                            }
                        }));
                        return [...prev, ...mappedChunks];
                    });
                }
            }
            
            setStatus('completed');

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            setStatus('error');
        }
    }, [apiKey, userInput, status, resetState, model]);


    const isProcessing = status === 'step1_generating' || status === 'step2_generating';
    const isCompleted = status === 'completed' || status === 'error';
    const showResults = status !== 'idle';

    return (
        <div className="min-h-screen bg-[#1a1b26] text-[#c0caf5] font-sans p-4 sm:p-8 flex flex-col">
            <Header />
            
            <div className="w-full max-w-2xl mx-auto mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="api-key-input" className="block text-sm font-medium text-[#a9b1d6] mb-1">Gemini API Key</label>
                    <input
                        id="api-key-input"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Gemini API Key here"
                        className="w-full bg-[#24283b] border-2 border-[#414868] rounded-lg p-3 text-[#c0caf5] placeholder-[#565f89] focus:outline-none focus:ring-2 focus:ring-[#7aa2f7] transition duration-200"
                    />
                    <p className="text-xs text-[#565f89] mt-1">Your API key is stored only in your browser's local storage.</p>
                </div>
                <div>
                    <label htmlFor="model-select" className="block text-sm font-medium text-[#a9b1d6] mb-1">Model</label>
                    <select 
                        id="model-select"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-[#24283b] border-2 border-[#414868] rounded-lg p-3 text-[#c0caf5] focus:outline-none focus:ring-2 focus:ring-[#7aa2f7] transition duration-200"
                    >
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                    </select>
                    <p className="text-xs text-[#565f89] mt-1">Pro model is slower but more thorough.</p>
                </div>
            </div>

            <InputForm
                userInput={userInput}
                setUserInput={setUserInput}
                isProcessing={isProcessing}
                isCompleted={isCompleted}
                isApiKeySet={!!apiKey}
                onStart={handleStartTest}
                onReset={resetState}
            />

            {error && (
                <div className="w-full max-w-4xl mx-auto my-4 p-4 bg-[#f7768e] bg-opacity-20 border border-[#f7768e] text-white rounded-lg">
                    <h3 className="font-bold">An Error Occurred</h3>
                    <p>{error}</p>
                </div>
            )}
            
            {showResults && (
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto mt-4">
                    <ResultCard 
                        title="Step 1: Internal Knowledge"
                        icon={<BrainIcon />}
                        content={step1Result}
                        isLoading={status === 'step1_generating'}
                    />
                    <ResultCard 
                        title="Step 2: Web Verification"
                        icon={<SearchIcon />}
                        content={step2Result}
                        isLoading={status === 'step2_generating'}
                    >
                        {searchResults.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-bold text-[#e0af68] mb-3">Sources Found:</h3>
                                <div className="space-y-2">
                                    {searchResults.map((chunk, index) => (
                                        <SourceLink key={index} source={chunk.web} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </ResultCard>
                </div>
            )}
        </div>
    );
}

export default App;
