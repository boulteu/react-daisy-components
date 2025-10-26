# React Daisy Components

A comprehensive collection of React components styled with Tailwind CSS and DaisyUI. Built with TypeScript, these components are designed for performance, accessibility, and developer experience.

- 📱 **Responsive** - Mobile-first design with responsive components
- 🚀 **Performance** - Optimized for speed with lazy loading and efficient rendering
- 🎨 **Design** - Styled with DaisyUI, and adapt to your theme for seamless integration
- ⚡ **TypeScript** - Full TypeScript support with comprehensive type definitions

## 📦 Setup

### Prerequisites

Make sure you have the following dependencies installed:

```bash
npm install react@^19.1.1 tailwindcss@^4.1.12 daisyui@^5.0.50
```

### Installation

```bash
npm install react-daisy-components
```

### Configuration

#### Tailwind CSS V4

Add to your main CSS file:

```css
@import "tailwindcss";
@plugin "daisyui";

@source "./node_modules/react-daisy-components";
```

#### Tailwind CSS V3

Add to your Tailwind configuration file:

```javascript
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{html,js,ts,tsx}",
    "./node_modules/react-daisy-components/**/*.{js,ts,tsx}"
  ],
  plugins: [require("daisyui")]
}
```

## 🌍 Internationalization (i18n)

All components automatically adapt to the page language (based on the HTML lang attribute) if translations are available (if not, the default language is English). Available translations:

- English 🇬🇧
- French 🇫🇷
- Spanish 🇪🇸

## 🧩 Components

### DataTable

Advanced data table with pagination, sorting, filtering, export and more.

#### Import

```javascript
import { DataTable } from 'react-daisy-components'
```

#### Basic Usage

A simple data table with basic functionality.

```tsx
import React from 'react'
import { DataTable } from 'react-daisy-components'

const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Carol', email: 'carol@example.com' }
];

const columns = [
  { key: 'id' },
  { key: 'name' },
  { key: 'email' }
];

function App() {
  return (
    <DataTable
      data={data}
      columns={columns}
    />
  );
}
```

#### Features

- **Pagination** - Data table with pagination controls
- **Sorting** - Enable column sorting to help users find and organize data
- **Filtering** - Add filtering capabilities to narrow down data
- **Search** - Search functionality across all columns using the search bar
- **Export** - Export the data to a CSV, JSON, or Excel file
- **Custom Cells** - Customize cells based on data values by using the cellRenderer prop
- **Custom Actions** - Add custom action buttons to the table
- **Row Selection** - Select multiple rows with checkboxes
- **Advanced** - Load data from an API endpoint (POST only)

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Object[] \| String` | - | Array of data objects (represents the table rows), see [API Mode](#api-mode) for String usage |
| `columns` | `Object[]` | - | Array of column definitions (represents the table columns) |
| `columns[].key` | `String` | - | Unique identifier for the column |
| `columns[].label` | `String` | - | Display label for the column header (default value: capitalized column key) |
| `columns[].sortable` | `Boolean` | `true` | Enable sorting for this column |
| `columns[].filterable` | `Boolean` | `true` | Enable filtering for this column |
| `columns[].searchable` | `Boolean` | `true` | Include this column in global search |
| `paginationConfig` | `Object` | - | Pagination configuration |
| `paginationConfig.maxVisiblePages` | `Number` | `5` | Maximum number of page buttons to show |
| `paginationConfig.showFirstLast` | `Boolean` | `true` | Show first/last page buttons |
| `paginationConfig.showPageInfo` | `Boolean` | `true` | Show current page info text |
| `paginationConfig.perPageOptions` | `Number[]` | `[5,10,25,50]` | Available items per page options |
| `paginationConfig.perPage` | `Number` | `10` | Default items per page |
| `tableClass` | `String` | `table-zebra` | Defines the table classes, can be tailwind/daisyui classes but custom classes are also supported |
| `exportFilename` | `String \| Boolean` | `table-export` | Defines the filename of the exported file. If false, the export button will disappear |
| `actionsConfig` | `Object` | - | Defines the actions buttons to be displayed in the table |
| `actionsConfig.actions` | `Object[]` | - | Array of action button configurations |
| `actionsConfig.actions[].action` | `String` | - | Action identifier |
| `actionsConfig.actions[].variant` | `String` | - | Button variant (success, warning, etc) |
| `actionsConfig.actions[].icon` | `String` | - | Button icon name |
| `actionsConfig.actions[].tooltip` | `String` | - | Button hover tooltip |
| `actionsConfig.actions[].disabled` | `Boolean` | `false` | Whether the action button is disabled |
| `selectionConfig` | `Object` | - | Defines the selection buttons to be displayed in the table |
| `selectionConfig.actions` | `Object[]` | - | Array of bulk action button configurations (same properties than `actionsConfig.actions`) |
| `selectionConfig.clearSelection` | `Boolean` | `true` | Show the clear selection button |
| `customParameters` | `Object` | - | Defines the additional parameters to be sent to the API |

#### Events

| Event | Description |
|-------|-------------|
| `onAction` | Fired when an action button is clicked |
| `onBulkAction` | Fired when a bulk action button is clicked |

#### Methods

| Method | Description |
|--------|-------------|
| `reloadData()` | Clear cache and reload data (API mode only) |

#### API Mode

When using a string URL for the `data` prop, the DataTable will make POST requests to fetch data. The API should handle the following parameters:

### Request Payload

| Parameter | Type | Description |
|-----------|------|-------------|
| `filters` | `Object` | Filters values to apply to the request |
| `page` | `Number` | Page number |
| `perPage` | `Number` | Items per page |
| `search` | `String` | Search term to apply to the request |
| `sort` | `Object` | Sort order to apply to the request |
| `customParameters` | `Object` | Additional parameters to be sent to the API |

### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| `data` | `Object[]` | Data returned from the request |
| `distinctValues` | `Object` | Distinct values of the columns (for the filters) |
| `page` | `Number` | Page number |
| `perPage` | `Number` | Items per page |
| `total` | `Number` | Total number of items |
| `totalPages` | `Number` | Total number of pages |

### MultiSelect

Powerful multi-selection component with search.

#### Import

```javascript
import { MultiSelect } from 'react-daisy-components'
```

#### Basic Usage

Simple multi-selection with predefined options.

```tsx
import React, { useState } from 'react'
import { MultiSelect } from 'react-daisy-components'

function App() {
  const options = ['Option 1', 'Option 2', 'Option 3']
  const [selected, setSelected] = useState([])

  return (
    <MultiSelect
      options={options}
      value={selected}
      onChange={setSelected}
    />
  );
}
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by [Boulteu](https://boulteu.com/)
