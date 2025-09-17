import React from 'react';
import type { Action } from '../types';
import IconRenderer from './IconRenderer';

interface ActionsProps {
  actions: Action[];
  onAction: (actionType: string) => void;
}

const Actions: React.FC<ActionsProps> = ({ actions, onAction }) => {
  const getButtonClass = (variant: string | undefined) => {
    const variantClasses = {
      'primary': 'btn-primary',
      'secondary': 'btn-secondary',
      'success': 'btn-success',
      'warning': 'btn-warning',
      'error': 'btn-error',
      'info': 'btn-info',
      'ghost': 'btn-ghost',
      'link': 'btn-link',
      'neutral': 'btn-neutral'
    };
    return variantClasses[variant as keyof typeof variantClasses] || '';
  };

  return (
    <>
      {actions.map((action, index) => (
        <div
          key={action.action}
          className={`tooltip tooltip-bottom ${index === 0 ? 'tooltip-left-aligned' : ''}`}
          data-tip={action.tooltip}
        >
          <button
            className={`btn btn-sm ${getButtonClass(action.variant)}`}
            disabled={action.disabled}
            onClick={() => onAction(action.action)}
          >
            {action.icon && (
              <IconRenderer
                icon={action.icon}
                className="w-3 h-3"
              />
            )}
          </button>
        </div>
      ))}
    </>
  );
};

export default Actions;
