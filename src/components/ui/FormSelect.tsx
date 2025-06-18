"use client";

import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder,
      className = "",
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Estilos inline para garantir que o texto seja sempre visível
    const selectStyle = {
      color: "#111827", // gray-900 em hex para garantir visibilidade
      backgroundColor: "#ffffff", // fundo branco
      ...style,
    };

    const baseClasses =
      "w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16829E] focus:border-[#16829E] h-[42px]";

    const errorClasses = error
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "";

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          style={selectStyle}
          className={`${baseClasses} ${errorClasses} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.length > 0
            ? options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={selectStyle}
                >
                  {option.label}
                </option>
              ))
            : children}
        </select>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
