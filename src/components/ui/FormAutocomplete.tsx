"use client";

import React, { useState, useRef, useEffect } from "react";

// Função para normalizar strings removendo acentos e convertendo para lowercase
const normalizeString = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

interface AutocompleteOption {
  value: string;
  label: string;
}

interface FormAutocompleteProps {
  label?: string;
  error?: string;
  helperText?: string;
  options?: AutocompleteOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const FormAutocomplete = React.forwardRef<
  HTMLDivElement,
  FormAutocompleteProps
>(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = "Digite para buscar...",
      value = "",
      onChange,
      required = false,
      disabled = false,
      className = "",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [filteredOptions, setFilteredOptions] =
      useState<AutocompleteOption[]>(options);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Sincronizar inputValue com value quando value muda externamente
    useEffect(() => {
      const selectedOption = options.find((opt) => opt.value === value);
      setInputValue(selectedOption ? selectedOption.label : value || "");
    }, [value, options]);

    // Filtrar opções baseado no input
    useEffect(() => {
      if (!inputValue.trim()) {
        setFilteredOptions(options);
        return;
      }

      const normalizedInput = normalizeString(inputValue.trim());
      const filtered = options.filter((option) => {
        const normalizedLabel = normalizeString(option.label);
        const normalizedValue = normalizeString(option.value);
        return (
          normalizedLabel.includes(normalizedInput) ||
          normalizedValue.includes(normalizedInput)
        );
      });
      setFilteredOptions(filtered);
      setHighlightedIndex(-1);
    }, [inputValue, options]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(true);

      // Se o valor exato não existe nas opções, passa o valor digitado
      const normalizedNewValue = normalizeString(newValue);
      const exactMatch = options.find(
        (opt) => normalizeString(opt.label) === normalizedNewValue
      );

      if (onChange) {
        onChange(exactMatch ? exactMatch.value : newValue);
      }
    };

    const handleOptionClick = (option: AutocompleteOption) => {
      setInputValue(option.label);
      setIsOpen(false);
      setHighlightedIndex(-1);

      if (onChange) {
        onChange(option.value);
      }
    };

    const handleInputFocus = () => {
      setIsOpen(true);
    };

    const handleInputBlur = (e: React.FocusEvent) => {
      // Delay para permitir clique nas opções
      setTimeout(() => {
        if (!listRef.current?.contains(e.relatedTarget as Node)) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      }, 150);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          setIsOpen(true);
          return;
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleOptionClick(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    // Scroll da opção destacada para a view quando usar teclado
    useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const highlightedElement = listRef.current.children[
          highlightedIndex
        ] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }, [highlightedIndex]);

    const baseClasses = `w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#16829E] focus:border-[#16829E] h-[42px] ${
      disabled
        ? "bg-gray-50 text-gray-500 cursor-not-allowed"
        : "bg-white text-gray-900"
    }`;

    const errorClasses = error
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "";

    return (
      <div className={`w-full relative ${className}`} ref={ref}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`${baseClasses} ${errorClasses} pr-10`}
            autoComplete="off"
          />

          {/* Seta dropdown */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Lista de opções */}
          {isOpen && (
            <ul
              ref={listRef}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              tabIndex={-1}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    className={`pl-3 pr-9 py-2 cursor-pointer text-sm ${
                      index === highlightedIndex
                        ? "bg-[#16829E] text-white"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                    {value === option.value && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </li>
                ))
              ) : (
                <li className="pl-3 pr-9 py-2 text-sm text-gray-500">
                  Nenhum resultado encontrado
                </li>
              )}
            </ul>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormAutocomplete.displayName = "FormAutocomplete";

export default FormAutocomplete;
