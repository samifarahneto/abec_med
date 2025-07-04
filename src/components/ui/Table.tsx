"use client";

import React from "react";

interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  mobileLabel?: string;
  hideOnMobile?: boolean;
}

interface TableAction<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  mobileCardRender?: (item: T) => React.ReactNode;
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = "Nenhum item encontrado",
  className = "",
  onRowClick,
  mobileCardRender,
}: TableProps<T>) {
  const getActionVariantClasses = (
    variant: TableAction<T>["variant"] = "secondary"
  ) => {
    switch (variant) {
      case "primary":
        return "text-[#16829E] hover:text-white bg-blue-50 hover:bg-[#16829E] border border-blue-200 hover:border-[#16829E]";
      case "danger":
        return "text-red-600 hover:text-white bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500";
      default:
        return "text-slate-600 hover:text-slate-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300";
    }
  };

  const renderCellValue = (
    item: T,
    column: TableColumn<T>
  ): React.ReactNode => {
    if (column.render) {
      return column.render(item);
    }
    const value = item[column.key as keyof T];
    // Convert primitive values to strings for display
    if (value === null || value === undefined) return "";
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }
    return String(value);
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      >
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#16829E] mx-auto"></div>
          <p className="text-gray-500 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div
        className={`hidden lg:block bg-white shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100/50 backdrop-blur-sm ${className}`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead className="bg-[#F1F1F1] border-b-2 border-gray-300/60">
              <tr className="backdrop-blur-sm">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-8 py-4 text-center text-xs font-bold text-slate-800 uppercase tracking-wide border-r border-gray-200/50 last:border-r-0 ${
                      column.headerClassName || ""
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="relative font-semibold">
                        {column.header}
                      </span>
                    </div>
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th className="px-8 py-4 text-center text-xs font-bold text-slate-800 uppercase tracking-wide">
                    <div className="flex justify-center">
                      <span className="relative font-semibold">Ações</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-gradient-to-b from-white to-gray-50/30 divide-y divide-gray-100/70">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-8 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-xl opacity-30"></div>
                        <svg
                          className="relative w-16 h-16 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-gray-600 mb-2">
                        {emptyMessage}
                      </p>
                      <p className="text-sm text-gray-400">
                        Adicione novos itens para começar
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className={`group hover:bg-gradient-to-r hover:from-blue-50/70 hover:via-indigo-50/50 hover:to-purple-50/30 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-100/50 ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${index % 2 === 0 ? "bg-white/80" : "bg-gray-50/40"}`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-8 py-2 whitespace-nowrap text-center ${
                          column.className || ""
                        }`}
                      >
                        <div className="group-hover:scale-[1.02] transition-all duration-300 ease-out flex justify-center">
                          {renderCellValue(item, column)}
                        </div>
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td className="px-8 py-2 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(item);
                              }}
                              className={`relative p-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md ${getActionVariantClasses(
                                action.variant
                              )} ${action.className || ""}`}
                              title={action.label}
                            >
                              <div className="relative z-10">{action.icon}</div>
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-6">
        {data.length === 0 ? (
          <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50/30 rounded-2xl shadow-xl shadow-gray-200/50 p-12 text-center border border-gray-100/50 backdrop-blur-sm">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-2xl opacity-40"></div>
              <svg
                className="relative w-20 h-20 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-600 mb-3">
              {emptyMessage}
            </p>
            <p className="text-sm text-gray-400">
              Adicione novos itens para começar
            </p>
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br from-white via-gray-50/50 to-blue-50/20 border border-gray-200/70 rounded-2xl p-6 shadow-lg shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 hover:border-[#16829E]/30 hover:scale-[1.02] backdrop-blur-sm ${
                onRowClick ? "cursor-pointer" : ""
              } group`}
              onClick={() => onRowClick?.(item)}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-indigo-50/0 to-purple-50/0 group-hover:from-blue-50/60 group-hover:via-indigo-50/40 group-hover:to-purple-50/20 rounded-2xl transition-all duration-500 pointer-events-none"></div>

              <div className="relative z-10">
                {mobileCardRender ? (
                  mobileCardRender(item)
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {columns
                        .filter((column) => !column.hideOnMobile)
                        .map((column) => (
                          <div
                            key={String(column.key)}
                            className="flex justify-between items-start"
                          >
                            <span className="text-sm font-semibold text-slate-600 min-w-0 flex-1 tracking-wide">
                              {column.mobileLabel || column.header}:
                            </span>
                            <div className="text-sm text-gray-900 ml-4 min-w-0 flex-1 text-right font-medium">
                              {renderCellValue(item, column)}
                            </div>
                          </div>
                        ))}
                    </div>

                    {actions && actions.length > 0 && (
                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200/50">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(item);
                            }}
                            className={`relative p-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md ${getActionVariantClasses(
                              action.variant
                            )} ${
                              action.className || ""
                            } backdrop-blur-sm group/button`}
                            title={action.label}
                          >
                            <div className="relative z-10 transform group-hover/button:scale-105 transition-transform duration-200">
                              {action.icon}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-lg opacity-0 group-hover/button:opacity-100 transition-opacity duration-200"></div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Table;
