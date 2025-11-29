import React from "react";

const Slide = () => {
  return (
    <div className="w-full  relative flex items-center justify-center">
      <img
        src="/assets/slide.jpg"
        alt=""
        className="w-full h-screen bg-center object-cover"
      />
      <h1 className="absolute text-3xl md:text-4xl lg:text-5xl text-white top-[30%] text-center w-2/3">
        Welcome Home! Anywhere you roam Stay in the moment. Make your memories.
      </h1>
    </div>
  );
};

export default Slide;
