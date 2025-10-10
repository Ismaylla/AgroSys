import type { ReactNode } from "react";
import { FaFilter } from "react-icons/fa";

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
  placeholder?: string;
}

interface FilterBarProps {
  filters: Filter[];
  onFilterChange?: (key: string, value: string) => void;
  children?: ReactNode;
  className?: string;
}

export function FilterBar({
  filters,
  onFilterChange,
  children,
  className = "",
}: FilterBarProps) {
  return (
    <div className={`card p-6 border-agro-200 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h3 className="text-lg font-bold text-agro-700 flex items-center gap-2">
          <FaFilter className="text-agro-600" />
          Filtros de Busca
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          {filters.map((filter) => (
            <select
              key={filter.key}
              className="input-field max-w-xs border-agro-200"
              onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            >
              <option value="">{filter.placeholder || filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}

          {children}
        </div>
      </div>
    </div>
  );
}
