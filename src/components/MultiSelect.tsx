import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon, CloseIcon } from '../icons';
import CheckBox from './CheckBox';
import { useI18n } from '../composables/useI18n';

interface MultiSelectProps {
  value: any[];
  options: any[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  onChange: (value: any[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  value = [],
  options = [],
  placeholder = '',
  error = false,
  disabled = false,
  onChange
}) => {
  const { t } = useI18n();
  const inputRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputWidth, setInputWidth] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState({
    top: '0px',
    left: '0px',
    width: '0px'
  });

  const selectedItems = value || [];
  const placeholderText = placeholder || t('multiselect.placeholder');
  
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    return options.filter(option => 
      String(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const calculatedSlices = useMemo(() => {
    if (inputWidth === 0) return 5;
    
    const averageTextLength = selectedItems.length > 0 
      ? selectedItems.reduce((sum, item) => sum + String(item).length, 0) / selectedItems.length
      : 8;
    
    const estimatedBadgeWidth = Math.max(60, averageTextLength * 8 + 40);
    const availableWidth = inputWidth - 40;
    const maxSlices = Math.floor(availableWidth / estimatedBadgeWidth);
    
    return Math.max(1, Math.min(maxSlices, selectedItems.length));
  }, [inputWidth, selectedItems]);

  const updateInputWidth = () => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.getBoundingClientRect().width);
    }
  };

  const calculateDropdownPosition = () => {
    if (!inputRef.current || !dropdownRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const dropdownHeight = Math.min(240, filteredOptions.length * 40 + 100);
    const windowHeight = window.innerHeight;
    
    const spaceBelow = windowHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;
    const openBelow = spaceBelow >= dropdownHeight || spaceBelow > spaceAbove;
    
    const top = openBelow 
      ? inputRect.bottom + 4 
      : inputRect.top - dropdownHeight - 4;
    
    setDropdownStyle({
      top: `${top}px`,
      left: `${inputRect.left}px`,
      width: `${inputRect.width}px`
    });
  };

  const openDropdown = () => {
    if (disabled) return;
    setIsOpen(true);
    setTimeout(() => {
      calculateDropdownPosition();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        calculateDropdownPosition();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 0);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setIsSearching(false);
    setSearchTerm('');
  };

  const isSelected = (option: any): boolean => selectedItems.includes(option);

  const toggleOption = (option: any) => {
    const newValue = [...selectedItems];
    const index = newValue.indexOf(option);
    
    if (index > -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(option);
    }
    
    onChange(newValue);
  };

  const removeItem = (item: any) => {
    const newValue = selectedItems.filter(i => i !== item);
    onChange(newValue);
  };

  const clearSelection = () => {
    onChange([]);
  };

  const handleKeydown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDropdown();
    } else if (event.key === 'Escape') {
      closeDropdown();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsSearching(false);
    }, 150);
  };

  const getBadgeWidthClass = (): string | undefined => {
    const count = selectedItems.length;
    if (count > calculatedSlices) return 'max-w-20';
    if (count > (calculatedSlices - 1)) return 'max-w-24';
  };

  const handleClickOutside = (event: Event) => {
    if (
      inputRef.current && 
      !inputRef.current.contains(event.target as Node) &&
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target as Node)
    ) {
      closeDropdown();
    }
  };

  const handleResize = () => {
    updateInputWidth();
    if (isOpen) {
      calculateDropdownPosition();
    }
  };

  useEffect(() => {
    updateInputWidth();
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      calculateDropdownPosition();
    }
  }, [isOpen, filteredOptions.length]);

  return (
    <div className="relative">
      <div
        className={`input input-bordered w-full min-h-[2.5rem] max-h-32 flex flex-wrap gap-1 p-2 cursor-text overflow-y-auto focus-within:outline-none focus-within:ring-0 ${
          error ? 'input-error' : ''
        }`}
        onClick={openDropdown}
        onKeyDown={handleKeydown}
        tabIndex={0}
        ref={inputRef}
      >
        {selectedItems.length > 0 && (
          <>
            {selectedItems.slice(0, calculatedSlices).map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={`badge badge-sm gap-1 bg-base-300 text-base-content border border-base-300 flex-shrink-0 ${getBadgeWidthClass() || ''}`}
              >
                <span className="truncate" title={String(item)}>{item}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs p-0 h-4 w-4 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item);
                  }}
                  title={t('multiselect.remove')}
                  aria-label={t('multiselect.remove')}
                >
                  <CloseIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {selectedItems.length > calculatedSlices && (
              <div className="badge badge-sm bg-base-300 text-base-content border border-base-300 flex-shrink-0">
                +{selectedItems.length - calculatedSlices}
              </div>
            )}
          </>
        )}

        {(!selectedItems.length || isSearching) && (
          <input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-0 bg-transparent outline-none text-sm focus:outline-none focus:ring-0"
            placeholder={selectedItems.length ? t('multiselect.search') : placeholderText}
            onFocus={() => setIsSearching(true)}
            onBlur={handleBlur}
          />
        )}

        <button
          type="button"
          className={`btn btn-ghost btn-xs p-0 h-4 w-4 ml-auto ${isOpen ? 'rotate-180' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown();
          }}
          aria-label={t('multiselect.toggleDropdown')}
        >
          <ChevronDownIcon className="w-3 h-3" />
        </button>
      </div>

      {isOpen && createPortal(
        <div
          className="fixed bg-base-100 border border-base-300 rounded-lg shadow-lg z-[9999] max-h-60 overflow-auto"
          ref={dropdownRef}
          style={dropdownStyle}
        >
          {selectedItems.length > 0 && (
            <div className="p-2 border-b border-base-300 focus-within:outline-none focus-within:ring-0">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-sm input-bordered w-full focus:outline-none focus:ring-0"
                placeholder={t('multiselect.searchOptions')}
                onFocus={() => setIsSearching(true)}
              />
            </div>
          )}

          <div className="py-1">
            {filteredOptions.map(option => (
              <div
                key={option}
                className={`px-3 py-2 cursor-pointer hover:bg-base-200 flex items-center gap-2 ${
                  isSelected(option) ? 'bg-base-300 text-base-content' : ''
                }`}
                onClick={() => toggleOption(option)}
              >
                <CheckBox
                  checked={isSelected(option)}
                  onChange={() => toggleOption(option)}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <span className="flex-1">{option ?? t('multiselect.empty')}</span>
              </div>
            ))}

            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-base-content/70 text-sm">
                {t('multiselect.noOptions')}
              </div>
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="p-2 border-t border-base-300 flex justify-between">
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={clearSelection}
                aria-label={t('multiselect.clearAll')}
              >
                {t('multiselect.clearAll')}
              </button>
              <span className="text-xs text-base-content/70">
                {selectedItems.length} {t('multiselect.selected')}
              </span>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default MultiSelect;
