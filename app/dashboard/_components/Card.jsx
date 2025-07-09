import React from 'react';

function Card({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-6 md:p-7 bg-sky-100 rounded-lg shadow-sm w-full">
      <div className="p-2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white text-primary flex items-center justify-center text-lg sm:text-xl">
        {icon}
      </div>
      <div className="truncate">
        <h2 className="font-bold text-sm sm:text-base md:text-lg truncate">{title}</h2>
        <h2 className="text-base sm:text-lg font-semibold">{value}</h2>
      </div>
    </div>
  );
}

export default Card;
