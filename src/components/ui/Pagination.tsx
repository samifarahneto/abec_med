import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}) => {
  // Calcular informações de paginação
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Gerar array de páginas para exibir
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Se temos poucas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas com elipses
      if (currentPage <= 3) {
        // Páginas iniciais
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Páginas finais
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Páginas do meio
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`w-full flex flex-row items-center gap-4 p-4 bg-white border-t border-gray-200 ${className}`}
    >
      {/* Informações sobre itens */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mr-auto">
        <span>
          Mostrando {startItem} a {endItem} de {totalItems} resultados
        </span>
      </div>

      {/* Controles de paginação alinhados à direita */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Primeira página */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center p-2 rounded-md transition-colors ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <FirstPageIcon fontSize="small" />
        </button>

        {/* Página anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center p-2 rounded-md transition-colors ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <ChevronLeftIcon fontSize="small" />
        </button>

        {/* Números das páginas */}
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-sm text-gray-500 select-none">
                ...
              </span>
            ) : currentPage === page ? (
              <span
                className="px-3 py-2 text-sm rounded-full bg-gray-200 text-gray-900 select-none"
                style={{
                  minWidth: 32,
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                {page}
              </span>
            ) : (
              <span
                onClick={() => onPageChange(page as number)}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer rounded-full transition-colors"
                style={{
                  minWidth: 32,
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                {page}
              </span>
            )}
          </React.Fragment>
        ))}

        {/* Próxima página */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center p-2 rounded-md transition-colors ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <ChevronRightIcon fontSize="small" />
        </button>

        {/* Última página */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center p-2 rounded-md transition-colors ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <LastPageIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
