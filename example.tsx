import React, { useState } from 'react';
import { DataTable, MultiSelect } from './src';
import type { ColumnState } from './src';

// Example usage of the React Daisy Components
const ExampleApp: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const columns: ColumnState[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true, searchable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'status', label: 'Status', filterable: true }
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
  ];

  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">React Daisy Components Example</h1>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">MultiSelect Component</h2>
        <MultiSelect
          value={selectedOptions}
          options={options}
          placeholder="Select options..."
          onChange={setSelectedOptions}
        />
        <p className="mt-2 text-sm text-gray-600">
          Selected: {selectedOptions.join(', ') || 'None'}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">DataTable Component</h2>
        <DataTable
          columns={columns}
          data={data}
          paginationConfig={{
            perPage: 2,
            showPageInfo: true
          }}
          exportFilename="example-export"
        />
      </div>
    </div>
  );
};

export default ExampleApp;
