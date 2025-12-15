import React, { forwardRef } from 'react';

const InputField = forwardRef(
  (
    {
      type = 'text',
      id,
      label,
      isRequired = false,
      placeholder = ' ',
      textarea = false,
      value,
      onChange,
      darkMode = false,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="relative w-full">
        {textarea ? (
          <textarea
            id={id}
            placeholder={placeholder}
            required={isRequired}
            value={value}
            onChange={onChange}
            ref={ref}
            className={`peer w-full border py-3 px-4 rounded-xl min-h-[120px]
              focus:outline-none focus:border-[#FF7F50] placeholder-transparent resize-none
              ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-[#D4D4D8] text-gray-900"}`}
            {...rest}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            required={isRequired}
            value={value}
            onChange={onChange}
            ref={ref}
            className={`peer w-full border py-3 px-4 rounded-xl
              focus:outline-none focus:border-[#FF7F50] placeholder-transparent
              ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-[#D4D4D8] text-gray-900"}`}
            {...rest}
          />
        )}
        <label
          htmlFor={id}
          className={`absolute left-4 top-3 text-base transition-all px-1
          peer-placeholder-shown:top-3
          peer-placeholder-shown:text-base
          peer-focus:top-[-10px]
          peer-focus:text-sm
          peer-focus:text-[#FF7F50]
          peer-[&:not(:placeholder-shown)]:top-[-10px]
          peer-[&:not(:placeholder-shown)]:text-sm
          peer-[&:not(:placeholder-shown)]:text-[#FF7F50]
          ${darkMode ? "bg-gray-800 text-gray-400 peer-placeholder-shown:text-gray-500" : "bg-white text-[#71717A] peer-placeholder-shown:text-[#A1A1AA]"}`}
        >
          {label}
        </label>
      </div>
    );
  }
);

InputField.displayName = 'InputField';
export default InputField;
