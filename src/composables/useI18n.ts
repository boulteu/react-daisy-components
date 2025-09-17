import { useState, useEffect } from 'react';

// Types for translations
export interface Translations {
  [key: string]: string | Translations;
}

// Available languages
export const availableLanguages = ['en', 'fr', 'es'] as const;
export type SupportedLanguage = typeof availableLanguages[number];

// Default language
export const defaultLanguage: SupportedLanguage = 'en';

// Default translations (English)
const defaultTranslations: Translations = {
  multiselect: {
    placeholder: 'Select options...',
    search: 'Search...',
    searchOptions: 'Search options...',
    noOptions: 'No options found',
    clearAll: 'Clear all',
    selected: 'selected',
    remove: 'Remove',
    empty: '(Empty)'
  },
  datatable: {
    noResults: 'No results found',
    clearSelection: 'Clear Selection',
    selected: 'selected'
  },
  pagination: {
    first: 'First page',
    previous: 'Previous page',
    next: 'Next page',
    last: 'Last page',
    goTo: 'Go to page',
    showing: 'Showing',
    itemsPerPage: 'Items per page',
    of: 'of',
    items: 'items'
  },
  filters: {
    title: 'Filters',
    filterData: 'Filter data',
    close: 'Close',
    resetAll: 'Reset all',
    select: 'Select'
  },
  export: {
    exportData: 'Export data',
    exportAsCSV: 'Export as CSV',
    exportAsJSON: 'Export as JSON',
    exportAsExcel: 'Export as Excel'
  }
};

// French translations
const frTranslations: Translations = {
  multiselect: {
    placeholder: 'Sélectionner des options...',
    search: 'Rechercher...',
    searchOptions: 'Rechercher des options...',
    noOptions: 'Aucune option trouvée',
    clearAll: 'Tout effacer',
    selected: 'sélectionné(s)',
    remove: 'Supprimer',
    empty: '(Vide)'
  },
  datatable: {
    noResults: 'Aucun résultat trouvé',
    clearSelection: 'Effacer la sélection',
    selected: 'sélectionné(s)'
  },
  pagination: {
    first: 'Première page',
    previous: 'Page précédente',
    next: 'Page suivante',
    last: 'Dernière page',
    goTo: 'Aller à la page',
    showing: 'Affichage',
    itemsPerPage: 'Éléments par page',
    of: 'sur',
    items: 'éléments'
  },
  filters: {
    title: 'Filtres',
    filterData: 'Filtrer les données',
    close: 'Fermer',
    resetAll: 'Réinitialiser tout',
    select: 'Sélectionner'
  },
  export: {
    exportData: 'Exporter les données',
    exportAsCSV: 'Exporter en CSV',
    exportAsJSON: 'Exporter en JSON',
    exportAsExcel: 'Exporter en Excel'
  }
};

// Spanish translations
const esTranslations: Translations = {
  multiselect: {
    placeholder: 'Seleccionar opciones...',
    search: 'Buscar...',
    searchOptions: 'Buscar opciones...',
    noOptions: 'No se encontraron opciones',
    clearAll: 'Limpiar todo',
    selected: 'seleccionado(s)',
    remove: 'Eliminar',
    empty: '(Vacío)'
  },
  datatable: {
    noResults: 'No se encontraron resultados',
    clearSelection: 'Limpiar selección',
    selected: 'seleccionado(s)'
  },
  pagination: {
    first: 'Primera página',
    previous: 'Página anterior',
    next: 'Página siguiente',
    last: 'Última página',
    goTo: 'Ir a la página',
    showing: 'Mostrando',
    itemsPerPage: 'Elementos por página',
    of: 'de',
    items: 'elementos'
  },
  filters: {
    title: 'Filtros',
    filterData: 'Filtrar datos',
    close: 'Cerrar',
    resetAll: 'Restablecer todo',
    select: 'Seleccionar'
  },
  export: {
    exportData: 'Exportar datos',
    exportAsCSV: 'Exportar como CSV',
    exportAsJSON: 'Exportar como JSON',
    exportAsExcel: 'Exportar como Excel'
  }
};

// Translation map
const translations: Record<SupportedLanguage, Translations> = {
  en: defaultTranslations,
  fr: frTranslations,
  es: esTranslations
};

// Get language from HTML lang attribute
const getLanguageFromHTML = (): SupportedLanguage => {
  if (typeof document === 'undefined') return defaultLanguage;
  
  const htmlLang = document.documentElement.lang;
  if (htmlLang && availableLanguages.includes(htmlLang as SupportedLanguage)) {
    return htmlLang as SupportedLanguage;
  }
  
  // Fallback to browser language
  const browserLang = navigator.language.split('-')[0];
  if (availableLanguages.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }
  
  return defaultLanguage;
};

// Get nested translation value
const getNestedValue = (obj: Translations, path: string): string => {
  return path.split('.').reduce((current: any, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return current[key];
    }
    return undefined;
  }, obj) as string || path; // Fallback to path if not found
};

// Hook for i18n
export const useI18n = () => {
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(defaultLanguage);

  useEffect(() => {
    setCurrentLanguageState(getLanguageFromHTML());

    // Watch for language changes in HTML
    const observer = new MutationObserver(() => {
      const newLang = getLanguageFromHTML();
      if (newLang !== currentLanguage) {
        setCurrentLanguageState(newLang);
      }
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });

    return () => observer.disconnect();
  }, [currentLanguage]);

  const t = (key: string): string => {
    const translation = translations[currentLanguage];
    return getNestedValue(translation, key);
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  const getCurrentLanguage = () => currentLanguage;

  return {
    t,
    setLanguage,
    getCurrentLanguage,
    availableLanguages,
    defaultLanguage
  };
};
