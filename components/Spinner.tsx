
import React from 'react';

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7aa2f7]"></div>
  </div>
);

export default Spinner;
