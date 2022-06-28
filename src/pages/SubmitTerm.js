import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

// /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

const SubmitTerm = () => {
  const [value, setValue] = useState(null);
  const [vocabulary, setVocabulary] = useState(null);
  const [term, setTerm] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);

  const onLoadingClick = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const vocabularies = [
    { icon: 'fa-duotone fa-diagram-project', vocabulary: 'term', label: 'Ontology Terms' },
    { icon: 'fa-duotone fa-angle-90', vocabulary: 'unit', label: 'Units' },
    { icon: 'fa-duotone fa-seedling', vocabulary: 'crop', label: 'Crops' },
  ];

  return (
    <Card title="Submit your Term">
      <div className="grid p-fluid">
        <div className="col-12 md:col-4 p-mb-4">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="fa-duotone fa-user" />
            </span>
            <InputText placeholder="Full Name" />
          </div>
        </div>
        <div className="col-12 md:col-4 p-mb-4">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="fa-duotone fa-envelope" />
            </span>
            <InputMask
              mask="a*-999-a999"
              value={value}
              onChange={(e) => setValue(e.value)}
              placeholder="e-mail"
            />
          </div>
        </div>
        <div className="col-12 md:col-4 p-mb-4">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="fa-duotone fa-list-ul" />
            </span>
            <Dropdown
              optionLabel="label"
              value={vocabulary}
              options={vocabularies}
              onChange={(e) => setVocabulary(e.value)}
              placeholder="Select a Vocabulary"
            />
          </div>
        </div>
        <div className="col-12 md:col-4 p-mb-4">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="fa-duotone fa-input-text" />
            </span>
            <InputText
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Write down your term"
            />
          </div>
        </div>
        <div className="col-12 md:col-4 p-mb-4">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="fa-duotone fa-text" />
            </span>
            <InputTextarea
              rows={5}
              cols={30}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write down a description for your term"
            />
          </div>
        </div>
        <div className="col-12 md:col-4 p-mb-4">
          <Button label="Submit" loading={loading} onClick={onLoadingClick} iconPos="right" />
        </div>
      </div>
    </Card>
  );
};

export default SubmitTerm;
