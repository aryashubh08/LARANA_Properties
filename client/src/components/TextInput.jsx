import React from "react";

const TextInput = ({ label, name, value, onChange }) => (
  <div className="pt-4 w-full md:w-1/2">
    <p className="text-sm font-medium">{label}</p>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="border rounded-lg py-2 px-4 w-full"
      placeholder={label}
      required
    />
  </div>
);

export default TextInput;
