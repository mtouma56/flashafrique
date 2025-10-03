import React from 'react';

interface FilterBarProps {
  countries: string[];
  sources: string[];
  selectedCountry: string;
  selectedSource: string;
  selectedDate: string;
  onCountryChange: (country: string) => void;
  onSourceChange: (source: string) => void;
  onDateChange: (date: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  countries,
  sources,
  selectedCountry,
  selectedSource,
  selectedDate,
  onCountryChange,
  onSourceChange,
  onDateChange,
  pageSize,
  onPageSizeChange,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-b border-neutral-200 dark:border-neutral-800 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="country-filter" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Filtres:
        </label>
        
        <select
          id="country-filter"
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 px-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Filtrer par pays"
        >
          <option value="">Tous les pays</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          id="source-filter"
          value={selectedSource}
          onChange={(e) => onSourceChange(e.target.value)}
          className="h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 px-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Filtrer par source"
        >
          <option value="">Toutes les sources</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>

        <input
          type="date"
          id="date-filter"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 px-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Filtrer par date"
        />

        {(selectedCountry || selectedSource || selectedDate) && (
          <button
            onClick={() => {
              onCountryChange('');
              onSourceChange('');
              onDateChange('');
            }}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            aria-label="Réinitialiser les filtres"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="page-size" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Par page:
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 px-3 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Nombre d'articles par page"
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
