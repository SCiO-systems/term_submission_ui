import React, { useEffect, useRef, useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import NodeService from '../services/NodeService';

const SearchTerm = () => {
  const [selectedTerms, setSelectedTerms] = useState(null);
  const [filteredTerms, setFilteredTerms] = useState(null);
  const [terms, setTerms] = useState(null);
  const [value, setValue] = useState(null);

  const dt = useRef(null);

  const justifyOptions = [
    { icon: 'fa-duotone fa-diagram-project', vocabulary: 'term', label: 'Variable/General Terms' },
    { icon: 'fa-duotone fa-angle-90', vocabulary: 'unit', label: 'Units' },
    { icon: 'fa-duotone fa-seedling', vocabulary: 'crop', label: 'Crops' },
  ];

  const justifyTemplate = (option) => <span><i className={option.icon} /> {option.label}</span>;

  useEffect(() => {
    setValue({ icon: 'fa-duotone fa-diagram-project', vocabulary: 'term', label: 'Variable/General Terms' });
  }, []); // eslint-disable-line

  const searchCategory = (event) => {
    const nodeService = new NodeService();

    if (value.vocabulary === 'term') {
      nodeService.getTermSuggestions(event.query).then(
        (result) => {
          setFilteredTerms(result.data);
        }
      );
    } else if (value.vocabulary === 'unit') {
      nodeService.getUnitSuggestions(event.query).then(
        (result) => {
          setFilteredTerms(result.data);
        }
      );
    } else if (value.vocabulary === 'crop') {
      nodeService.getCropSuggestions(event.query).then(
        (result) => {
          setFilteredTerms(result.data);
        }
      );
    }
  };

  const updateTerms = (e) => {
    setTerms(e.value);
    setSelectedTerms(e.value);
  };

  const header = (
    <div className="flex align-items-center export-buttons">
      <Button
        type="button"
        icon="fa-solid fa-file-csv"
        onClick={() => exportCSV(false)}
        className="mr-2"
        data-pr-tooltip="CSV"
        disabled={!terms}
      />
    </div>
  );

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const autolink = (rowData) => (
    <>
      <a target="_blank" href={rowData.id} rel="noreferrer">{rowData.id}</a>
    </>
  );

  return (
    <Card>
      <div className="p-mb-2">
        <SelectButton
          value={value}
          options={justifyOptions}
          onChange={(e) => setValue(e.value)}
          itemTemplate={justifyTemplate}
          optionLabel="label"
        />
      </div>
      <div className="p-mb-6">
        <div className="p-inputgroup">
          <AutoComplete
            placeholder="Search Terms"
            value={selectedTerms}
            suggestions={filteredTerms}
            completeMethod={searchCategory}
            field="term"
            multiple
            onChange={(e) => updateTerms(e)}
            aria-label="Categories"
          />
          <Button icon="fa-duotone fa-magnifying-glass" className="p-button-primary" />
        </div>
      </div>
      <DataTable
        ref={dt}
        value={terms}
        paginator
        className="p-datatable-customers"
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        rowHover
        responsiveLayout="scroll"
        emptyMessage="No terms selected."
        resizableColumns
        showGridlines
        header={header}
      >
        <Column field="term" header="Term" sortable style={{ width: '8rem' }} />
        <Column field="description" header="Description" style={{ minWidth: '10rem' }} />
        <Column field="id" header="URI" sortable body={autolink} />
        <Column field="scheme" header="Ontology/Vocabulary" sortable style={{ width: '14rem' }} />

      </DataTable>
    </Card>
  );
};

export default SearchTerm;
