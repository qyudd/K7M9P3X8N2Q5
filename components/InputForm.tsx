
import React from 'react';

interface InputFormProps {
    userInput: string;
    setUserInput: (value: string) => void;
    isProcessing: boolean;
    isCompleted: boolean;
    onStart: () => void;
    onReset: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ userInput, setUserInput, isProcessing, isCompleted, onStart, onReset }) => {
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isProcessing && userInput.trim()) {
            onStart();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a work title (e.g., 'One Piece', 'Dune')"
                    disabled={isProcessing}
                    className="flex-grow bg-[#24283b] border-2 border-[#414868] rounded-lg p-3 text-[#c0caf5] placeholder-[#565f89] focus:outline-none focus:ring-2 focus:ring-[#7aa2f7] transition duration-200 disabled:opacity-50"
                />
                <button
                    onClick={isCompleted ? onReset : onStart}
                    disabled={isProcessing || (!isCompleted && !userInput.trim())}
                    className={`px-6 py-3 font-bold rounded-lg transition duration-200 text-[#1a1b26] disabled:opacity-50 disabled:cursor-not-allowed
                    ${isCompleted 
                        ? 'bg-[#f7768e] hover:bg-opacity-90' 
                        : 'bg-[#7aa2f7] hover:bg-opacity-90'
                    }`}
                >
                    {isProcessing ? 'Processing...' : (isCompleted ? 'Start New Test' : 'Start Test')}
                </button>
            </div>
        </div>
    );
};

export default InputForm;
