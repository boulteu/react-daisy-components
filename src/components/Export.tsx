import React from 'react';
import type { ColumnState } from '../types';
import { useExport } from '../composables/useExport';
import { DownloadIcon } from '../icons';
import { useI18n } from '../composables/useI18n';

interface ExportProps {
  data: any[];
  columns: ColumnState[];
  filename?: string;
}

const Export: React.FC<ExportProps> = ({ data, columns, filename }) => {
  const { t } = useI18n();
  const { exportToCSV, exportToJSON, exportToExcel } = useExport();

  const handleExportCSV = () => {
    exportToCSV(data, columns, {
      filename: filename ? `${filename}.csv` : 'export.csv'
    });
  };

  const handleExportJSON = () => {
    exportToJSON(data, {
      filename: filename ? `${filename}.json` : 'export.json'
    });
  };

  const handleExportExcel = () => {
    exportToExcel(data, columns, {
      filename: filename ? `${filename}.xlsx` : 'export.xlsx'
    });
  };

  return (
    <div className="dropdown dropdown-start">
      <div className="tooltip tooltip-bottom" data-tip={t('export.exportData')}>
        <button className="btn btn-sm" tabIndex={0} aria-label={t('export.exportData')}>
          <DownloadIcon className="w-3 h-3" />
        </button>
      </div>
      
      <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <button onClick={handleExportCSV} className="flex items-center gap-2" title={t('export.exportAsCSV')} aria-label={t('export.exportAsCSV')}>
            {t('export.exportAsCSV')}
          </button>
        </li>
        <li>
          <button onClick={handleExportJSON} className="flex items-center gap-2" title={t('export.exportAsJSON')} aria-label={t('export.exportAsJSON')}>
            {t('export.exportAsJSON')}
          </button>
        </li>
        <li>
          <button onClick={handleExportExcel} className="flex items-center gap-2" title={t('export.exportAsExcel')} aria-label={t('export.exportAsExcel')}>
            {t('export.exportAsExcel')}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Export;
