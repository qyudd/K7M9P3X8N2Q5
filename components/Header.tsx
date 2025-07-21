
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#c0caf5]">
                AI Knowledge <span className="text-[#7aa2f7]">Verification Test</span>
            </h1>
            <p className="text-[#a9b1d6] mt-2 text-lg">
                How well does Gemini know your favorite series?
            </p>
        </header>
    );
};

export default Header;
