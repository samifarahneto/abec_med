"use client";

import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: "default" | "search";
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      variant = "default",
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    // Estilos inline para garantir que o texto seja sempre visível
    const inputStyle = {
      color: "#111827", // gray-900 em hex para garantir visibilidade
      backgroundColor: "#ffffff", // fundo branco
      ...style,
    };

    const baseClasses =
      variant === "search"
        ? "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16829E] focus:border-transparent h-[42px]"
        : `w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16829E] focus:border-[#16829E] h-[42px] ${
            props.type === "date" ? "date-input" : ""
          }`;

    const errorClasses = error
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "";

    return (
      <div className={variant === "default" ? "w-full" : ""}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={variant === "search" ? "relative" : ""}>
          {icon && variant === "search" && (
            <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
          )}

          <input
            ref={ref}
            style={{
              ...inputStyle,
              ...(props.type === "date" && { lineHeight: "42px" }),
            }}
            className={`${baseClasses} ${errorClasses} ${className}`}
            {...props}
          />
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
