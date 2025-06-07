"use client";

import React from "react";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, className = "", style, ...props }, ref) => {
    // Estilos inline para garantir que o texto seja sempre visível
    const textareaStyle = {
      color: "#111827", // gray-900 em hex para garantir visibilidade
      backgroundColor: "#ffffff", // fundo branco
      ...style,
    };

    const baseClasses =
      "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16829E] focus:border-[#16829E] resize-vertical";

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

        <textarea
          ref={ref}
          style={textareaStyle}
          className={`${baseClasses} ${errorClasses} ${className}`}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
