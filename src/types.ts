export interface ColumnState {
  key: string;
  label?: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
}

export interface PaginationConfig {
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  showPageInfo?: boolean;
  perPageOptions?: number[];
  perPage?: number;
}

export type FinalPaginationConfig = Required<PaginationConfig>;

export interface ActionsConfig {
  actions?: Action[];
}

export interface SelectionConfig {
  actions?: Action[];
  clearSelection?: boolean;
}

export interface Action {
  action: string;
  variant?: 'default' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'outline';
  icon?: string | any; // string for icon name, any for component
  disabled?: boolean;
  tooltip?: string;
}

export interface SortState {
  column: string | null;
  ascending: boolean;
}

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  delimiter?: string;
  dateFormat?: string;
  numberFormat?: string;
}

export interface ApiRequestParams {
  filters: Record<string, string[]>;
  search: string;
  sort: {
    column: string | null;
    ascending: boolean;
  };
  page: number;
  perPage: number;
  customParameters?: Record<string, any>;
}

export interface ApiResponse {
  data: Record<string, any>[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  distinctValues: Record<string, any[]>;
}

export interface DataTableRef {
  reloadData: () => void;
}
