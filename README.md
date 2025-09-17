# React Daisy Components

Beautiful and optimized React components styled with Tailwind CSS and DaisyUI.

## Features

- **DataTable**: Advanced data table with sorting, filtering, pagination, and export functionality
- **MultiSelect**: Multi-selection dropdown with search and keyboard navigation
- **Internationalization**: Built-in support for English, French, and Spanish
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **Accessibility**: WCAG compliant components with proper ARIA attributes
- **Responsive**: Mobile-first design that works on all screen sizes

## Installation

```bash
npm install react-daisy-components
```

## Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install react react-dom tailwindcss daisyui
```

## Usage

### DataTable

```tsx
import { DataTable } from 'react-daisy-components';
import type { ColumnState } from 'react-daisy-components';

const columns: ColumnState[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true, searchable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true },
  { key: 'status', label: 'Status', filterable: true }
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' }
];

function App() {
  return (
    <DataTable
      columns={columns}
      data={data}
      paginationConfig={{
        perPage: 10,
        showPageInfo: true
      }}
      exportFilename="users"
    />
  );
}
```

### MultiSelect

```tsx
import { MultiSelect } from 'react-daisy-components';

function App() {
  const [selected, setSelected] = useState([]);
  const options = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <MultiSelect
      value={selected}
      options={options}
      placeholder="Select options..."
      onChange={setSelected}
    />
  );
}
```

## API Reference

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnState[]` | - | Column definitions |
| `data` | `any[] \| string` | - | Data array or API endpoint URL |
| `paginationConfig` | `PaginationConfig` | `{}` | Pagination settings |
| `tableClass` | `string` | `'table-zebra'` | CSS classes for table |
| `exportFilename` | `string \| boolean` | `true` | Export filename or disable export |
| `actionsConfig` | `ActionsConfig` | - | Action buttons configuration |
| `selectionConfig` | `SelectionConfig` | - | Row selection configuration |
| `customParameters` | `Record<string, any>` | - | Custom API parameters |
| `onBulkAction` | `(action: string, data: any[]) => void` | - | Bulk action handler |
| `onAction` | `(action: string) => void` | - | Action handler |

### MultiSelect Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any[]` | `[]` | Selected values |
| `options` | `any[]` | `[]` | Available options |
| `placeholder` | `string` | `''` | Placeholder text |
| `error` | `boolean` | `false` | Error state |
| `disabled` | `boolean` | `false` | Disabled state |
| `onChange` | `(value: any[]) => void` | - | Change handler |

## Internationalization

The components support multiple languages out of the box:

- English (en) - Default
- French (fr)
- Spanish (es)

The language is automatically detected from the HTML `lang` attribute or browser settings.

## License

MIT
