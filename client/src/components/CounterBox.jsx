import React from "react";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";

const CounterBox = ({ title, count, setCount }) => (
  <div className="border p-3 flex justify-between items-center rounded border-gray-400 w-full min-w-0">
    <p className="text-gray-700 truncate">{title}</p>

    <div className="flex items-center gap-2 flex-shrink-0">
      <FiPlusCircle
        className="text-xl cursor-pointer"
        onClick={() => setCount(count + 1)}
      />
      <span>{count}</span>
      <FiMinusCircle
        className="text-xl cursor-pointer"
        onClick={() => count > 1 && setCount(count - 1)}
      />
    </div>
  </div>
);

export default CounterBox;
