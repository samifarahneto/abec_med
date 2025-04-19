import { FaTimes } from "react-icons/fa";

interface ModalEditAdminProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: (e: React.FormEvent) => Promise<void>;
}

export default function ModalEditAdmin({
  isOpen,
  onClose,
  title,
  children,
  onSave,
}: ModalEditAdminProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6">{children}</div>

        {/* Rodapé do Modal */}
        <div className="flex justify-end gap-4 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={onSave}
            className="px-4 py-2 bg-[#16829E] text-white rounded-lg hover:bg-[#126a7e] transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
