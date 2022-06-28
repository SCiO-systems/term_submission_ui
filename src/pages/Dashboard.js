import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { UserContext } from '../store';
import NodeService from '../services/NodeService';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const emptyProduct = {
    id: null,
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK',
  };

  const [loadingMyQuestionnaires, setLoadingMyQuestionnaires] = useState(true);
  const [myQuestionnaires, setMyQuestionnaires] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState([]);

  const [selectedMyQuestionnaires, setSelectedMyQuestionnaires] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const { setUser } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    loadMyQuestionnaires();
  }, []); // eslint-disable-line

  const loadMyQuestionnaires = () => {
    setLoadingMyQuestionnaires(true);
    const ns = new NodeService();
    ns.getQuestionnaires()
      .then(
        (data) => {
          if (data.length) {
            setMyQuestionnaires(data);
            setLoadingMyQuestionnaires(false);

            const initDeleteDialog = {};
            data.forEach(
              (localQuestionnaire) => {
                const tempUUID = localQuestionnaire.uuid;
                initDeleteDialog[tempUUID] = false;
              }
            );
            setDeleteConfirm(initDeleteDialog);
          } else {
            setMyQuestionnaires([]);
            setLoadingMyQuestionnaires(false);
          }
        }
      ).catch(
        (data) => console.log(data)
      );
  };

  const goToProject = (id) => {
    history.push(`/projects/${id}`);
  };

  const inviteToProject = (id) => {
    setSelectedProject(projects.filter((p) => p?.id === id)?.pop());
    setInviteDialogOpen(true);
  };

  const openNew = () => {
    history.push('/create-questionnaire');
  };

  const reloadMyQuestionnaires = () => {
    loadMyQuestionnaires();
  };

  const leftToolbarTemplate = () => (
    <>
      <Button label="New" icon="fa-duotone fa-plus" className="p-button-success p-mr-2 p-mb-2" onClick={openNew} />
    </>
  );

  const rightToolbarTemplate = () => (
    <>
      <Button
        label="Refresh"
        icon="fa-duotone fa-arrow-rotate-right"
        className="p-button-secondary p-mr-2 p-mb-2"
        onClick={reloadMyQuestionnaires}
      />
    </>
  );

  const nameBodyTemplate = (rowData) => (
    <>
      <span className="p-column-title">Name</span>
      {rowData.name}
    </>
  );

  const languageBodyTemplate = (rowData) => {
    let language = 'N/A';
    if (rowData.language) {
      language = rowData.language[0].name;
    }
    return (
      <>
        <span className="p-column-title">Language</span>
        {language}
      </>
    );
  };
  const versionBodyTemplate = (rowData) => (
    <>
      <span className="p-column-title">Version</span>
      {rowData.version}
    </>
  );

  const loadQuestionnaire = (localQuestionnaire) => {
    const ns = new NodeService();
    ns.getQuestionnaire(localQuestionnaire.uuid)
      .then(
        (data) => {
          history.push({ pathname: '/edit-questionnaire', state: { questionnaire: data } });
        }
      ).catch(
        (data) => console.log(data)
      );
  };

  const deleteQuestionnaire = (localQuestionnaire) => {
    const ns = new NodeService();
    ns.deleteQuestionnaire(localQuestionnaire.uuid)
      .then(
        () => {
          // eslint-disable-next-line consistent-return
          const filtered = myQuestionnaires.filter((item) => {
            {
              if (item.uuid !== localQuestionnaire.uuid) {
                return item;
              }
            }
          });

          setMyQuestionnaires([...filtered]);
          setSelectedMyQuestionnaires([]);
        }
      ).catch(
        (data) => console.log(data)
      );
  };

  const deleteQuestionnaires = () => {
    const ns = new NodeService();
    selectedMyQuestionnaires.foreach(
      (item) => {
        ns.deleteQuestionnaire(item.uuid)
          .then(
            () => {
              // eslint-disable-next-line consistent-return
              const filtered = myQuestionnaires.filter((itemQ) => {
                {
                  if (itemQ.uuid !== itemQ.uuid) {
                    return item;
                  }
                }
              });
              setMyQuestionnaires([...filtered]);
              setSelectedMyQuestionnaires([]);
            }
          ).catch(
            (data) => console.log(data)
          );
      });
  };

  const actionBodyTemplate = (rowData) => {
    const { uuid } = rowData;
    const accept = () => {
      setLoadingMyQuestionnaires(true);
      deleteQuestionnaire(rowData);
      setLoadingMyQuestionnaires(false);
      toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Success', life: 3000 });
    };

    const reject = () => {
      toast.current.show({ severity: 'info', summary: 'Rejected', detail: '', life: 3000 });
    };

    return (

      <div className="actions">
        <ConfirmPopup
          target={document.getElementById(`delete_button_${rowData.uuid}`)}
          visible={deleteConfirm[uuid]}
          onHide={
            () => {
              deleteConfirm[uuid] = false;
              setDeleteConfirm({ ...deleteConfirm });
            }
          }
          message="Are you sure you want to proceed?"
          icon="fa-duotone fa-triangle-exclamation"
          accept={accept}
          reject={reject}
        />
        <Button
          icon="fa-duotone fa-pen-to-square"
          className="p-button-success p-mr-2"
          onClick={() => loadQuestionnaire(rowData)}
        />
        <Button
          id={`delete_button_${rowData.uuid}`}
          icon="fa-duotone fa-trash"
          className="p-button-danger"
          onClick={() => {
            accept();
            // deleteConfirm[uuid] = true;
            // setDeleteConfirm({ ...deleteConfirm });
          }}
        />

      </div>
    );
  };

  const template = (options) => {
    const toggleIcon = options.collapsed ? 'fa-duotone fa-chevron-down' : 'fa-duotone fa-chevron-up';
    const className = `${options.className} justify-content-start`;
    const titleClassName = `${options.titleClassName} pl-1`;

    return (
      <div className={className}>
        <Button className={options.togglerClassName} onClick={options.onTogglerClick}>
          <span className={toggleIcon} />
          <Ripple />
        </Button>
        <span className={titleClassName}>
          {options.props.header}
        </span>
      </div>
    );
  };

  return (
    <div className="p-grid crud-demo">
      <Toast ref={toast} />
      <Splitter layout="vertical">
        <SplitterPanel size={20}>
          <div className="p-col-12">
            <Panel header="My Questionnaires" toggleable headerTemplate={template}>
              <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
              <DataTable
                ref={dt}
                value={myQuestionnaires}
                selection={selectedMyQuestionnaires}
                onSelectionChange={(e) => setSelectedMyQuestionnaires(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} questionnaires"
                globalFilter={globalFilter}
                emptyMessage="No questionnaires found."
                loading={loadingMyQuestionnaires}
                selectionMode="checkbox"
              >
                <Column field="metadata.title" header="Title" sortable />
                <Column field="metadata.language.name" header="Language" sortable />
                <Column field="metadata.version" header="Version" sortable />
                <Column body={actionBodyTemplate} />
              </DataTable>

            </Panel>
          </div>
        </SplitterPanel>
        <SplitterPanel size={20}>
          <div className="p-col-12">
            <Panel header="Shared with me" toggleable headerTemplate={template}>
              <DataTable
                ref={dt}
                value={[]}
                selection={[]}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} questionnaires"
                globalFilter={globalFilter}
                emptyMessage="No questionnaires found."
              >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="name" header="Title" sortable body={nameBodyTemplate} />
                <Column field="category" header="Language" sortable body={languageBodyTemplate} />
                <Column field="rating" header="Version" body={versionBodyTemplate} sortable />
                <Column body={actionBodyTemplate} />
              </DataTable>
            </Panel>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
};

export default Dashboard;
