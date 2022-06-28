import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TextArea = ({ rows, cols, value, register, errors, name, label, required = false }) => {
  const { t } = useTranslation();

  return (
    <div className="p-field p-fluid">
      <label htmlFor={name}>{label}</label>
      <InputTextarea
        className={errors[name]?.type === 'required' ? 'p-invalid' : ''}
        rows={rows}
        cols={cols}
        autoResize
        id={name}
        {...register(name, { required, value })}
      />
      {errors[name]?.type === 'required' && (
        <small id={`${name}-help`} className="p-error p-d-block">
          {t('FIELD_IS_REQUIRED')}
        </small>
      )}
    </div>
  );
};

export default TextArea;
