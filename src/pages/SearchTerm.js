import React, { useEffect, useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';

const SearchTerm = () => {
  const [selectedCountries, setSelectedCountries] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);

  const [value, setValue] = useState(null);

  const justifyOptions = [
    { icon: 'fa-duotone fa-diagram-project', vocabulary: 'term', label: 'Ontology Terms' },
    { icon: 'fa-duotone fa-angle-90', vocabulary: 'unit', label: 'Units' },
    { icon: 'fa-duotone fa-seedling', vocabulary: 'crop', label: 'Crops' },
  ];

  const justifyTemplate = (option) => <span><i className={option.icon} /> {option.label}</span>;

  useEffect(() => {
    setValue({ icon: 'fa-duotone fa-diagram-project', vocabulary: 'term', label: 'Ontology Terms' });
  }, []); // eslint-disable-line

  const searchCountry = (event) => {

  };

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
      <div className="col-12">
        <div className="p-inputgroup">
          <AutoComplete
            placeholder="Search Terms"
            value={selectedCountries}
            suggestions={filteredCountries}
            completeMethod={searchCountry}
            field="name"
            multiple
            onChange={(e) => setSelectedCountries(e.value)}
            aria-label="Countries"
          />
          <Button icon="fa-duotone fa-magnifying-glass" className="p-button-primary" />
        </div>
      </div>
    </Card>
  );
};

export default SearchTerm;
