import React from 'react';
import {
  AddIcon,
  ChevronDownIcon,
  CloseIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FilterIcon,
  NoResultIcon,
  RefreshIcon,
  SearchIcon,
  SortIcon,
  SortAscIcon,
  SortDescIcon
} from '../icons';

interface IconRendererProps {
  icon: string | React.ComponentType<any>;
  className?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ icon, className }) => {
  const iconMap = {
    'add': AddIcon,
    'chevron-down': ChevronDownIcon,
    'close': CloseIcon,
    'delete': DeleteIcon,
    'download': DownloadIcon,
    'edit': EditIcon,
    'eye': EyeIcon,
    'filter': FilterIcon,
    'no-result': NoResultIcon,
    'refresh': RefreshIcon,
    'search': SearchIcon,
    'sort': SortIcon,
    'sort-asc': SortAscIcon,
    'sort-desc': SortDescIcon
  };

  if (typeof icon === 'string') {
    const IconComponent = iconMap[icon as keyof typeof iconMap];
    return IconComponent ? <IconComponent className={className} /> : null;
  }
  
  const IconComponent = icon;
  return <IconComponent className={className} />;
};

export default IconRenderer;
