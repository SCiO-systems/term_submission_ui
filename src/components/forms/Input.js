import { InputText } from 'primereact/inputtext';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Input = ({ register, errors, name, label, value, required = false }) => {
  const { t } = useTranslation();

  return (
    <div className="p-field p-fluid">
      <label htmlFor={name}>{label}</label>
      <InputText
        className={errors[name]?.type === 'required' ? 'p-invalid' : ''}
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

export default Input;
