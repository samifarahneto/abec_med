import { ReactNode } from "react";

interface FormLayoutProps {
  title: string;
  children: ReactNode;
  onBack?: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
}

// Removed the outer div (min-h-screen, max-w-4xl, etc.) and the component's own header.
// This component now expects to be placed inside a MainLayout or similar container.
export default function FormLayout({
  title,
  children,
  onBack,
  onSubmit,
  onCancel,
  submitText = "Salvar",
  cancelText = "Cancelar",
}: FormLayoutProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cabeçalho Interno do Formulário (Opcional, pode ser removido se o título for gerenciado pela página) */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              title="Voltar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <h2 className="text-xl font-semibold text-[#16829E]">{title}</h2>
        </div>
      </div>

      {/* Conteúdo do Formulário */}
      <form onSubmit={onSubmit} className="space-y-6 p-6">
        {children}

        {/* Botões de Ação */}
        {(onSubmit || onCancel) && (
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
            )}
            {onSubmit && (
              <button
                type="submit"
                className="px-6 py-2 bg-[#16829E] text-white rounded-lg hover:bg-[#126a7e] transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {submitText}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

