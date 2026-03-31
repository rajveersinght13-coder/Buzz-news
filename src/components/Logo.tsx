import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center p-2 border-[6px] border-red-800 rounded-2xl ${className}`}>
      <div className="text-red-800 font-black text-4xl leading-none tracking-tighter" style={{ fontFamily: 'system-ui' }}>
        <span style={{ 
          display: 'inline-block',
          position: 'relative',
          color: '#991b1b',
          WebkitTextFillColor: 'transparent',
          WebkitTextStroke: '1px #991b1b',
          backgroundImage: 'linear-gradient(to bottom, #991b1b 45%, white 45%, white 55%, #991b1b 55%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text'
        }}>
          BUZZ
        </span>
      </div>
      <div className="text-red-800 font-black text-xl tracking-[0.2em] -mt-1">
        NEWS
      </div>
    </div>
  );
};
