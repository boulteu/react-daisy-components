import React from 'react';

interface CheckBoxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: (event: React.MouseEvent) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  checked = false,
  indeterminate = false,
  onChange,
  onClick
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked);
  };

  return (
    <label>
      <input
        type="checkbox"
        className={`checkbox checkbox-sm focus:outline-none focus:ring-0 custom-checkbox ${
          checked || indeterminate ? '!bg-base-300 !border-base-300' : ''
        }`}
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
        onChange={handleChange}
        onClick={onClick}
      />
    </label>
  );
};

export default CheckBox;
