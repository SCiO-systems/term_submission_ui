import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useHistory } from 'react-router-dom';
import ProjectDetails from '../components/forms/ProjectDetails';
import { createProject } from '../services/projects';
import { ToastContext } from '../store';
import { handleError } from '../utilities/errors';

const CreateProject = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { register, formState: { errors }, handleSubmit } = useForm();
  const { setError, setSuccess } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await createProject(data);
      setSuccess('Success', 'Your project has been created.');
      setTimeout(() => history.push('/'), 1500);
    } catch (e) {
      setError(handleError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-dashboard">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card title={t('PROJECT_DETAILS')} subTitle={t('PROJECT_DETAILS_SUBTITLE')}>
          <ProjectDetails register={register} errors={errors} />
        </Card>
        <div className="p-d-flex p-jc-start p-mt-4 p-mb-6">
          <Button className="p-button-lg" loading={loading} disabled={loading} type="submit" label={t('CREATE_PROJECT')} icon="pi pi-plus" />
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
