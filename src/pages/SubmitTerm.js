import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Captcha } from 'primereact/captcha';
import { Messages } from 'primereact/messages';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import NodeService from '../services/NodeService';

// /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

const SubmitTerm = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [vocabulary, setVocabulary] = useState(null);
  const [term, setTerm] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [isRobot, setRobot] = useState(true);
  const [loading, setLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);

  const fullNameMsg = useRef(null);
  const emailMsg = useRef(null);
  const selectCategoryMsg = useRef(null);
  const termMsg = useRef(null);
  const descriptionMsg = useRef(null);

  const emailPattern =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  useEffect(() => {
  }, []);

  const onLoadingClick = () => {
    setLoading(true);

    const isValidForm = checkValidity();

    if (isValidForm) {
      if (!isRobot) {
        const submitter = {
          fullname,
          email,
        };

        const submittedTerm = {
          term,
          description,
          reference,
          vocabulary: vocabulary.vocabulary,
          submitter,

        };

        const nodeService = new NodeService();

        nodeService.postTerm(submittedTerm).then(
          (res) => {
            // eslint-disable-next-line no-underscore-dangle
            if (res._id) {
              setDisplayModal(true);
            }
          }
        );
      } else {
        console.warn('ROBOT');
      }
    } else {
      console.warn('MANDATORY');
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const onHide = () => {
    setDisplayModal(false);
  };

  const showResponse = (e) => {
    const nodeService = new NodeService();
    nodeService.validateCAPTCHA(e.response).then(
      (result) => {
        setRobot(!result.success);
      }
    );
  };

  const checkValidity = () => {
    let valid = false;

    if ((fullname.length > 3) &&
      (email.length > 3) && (email.match(emailPattern)) &&
      (vocabulary) &&
      (term.length > 1) &&
      (description.length > 1)) {
      valid = true;
    } else {
      valid = false;

      if (fullname.length < 3) {
        fullNameMsg.current.show({ severity: 'error', summary: 'This field is mandatory' });
      }

      if (email.length < 3) {
        emailMsg.current.show({ severity: 'error', summary: 'This is not a valid email' });
      }

      if (!email.match(emailPattern)) {
        emailMsg.current.show({ severity: 'error', summary: 'This is not a valid email' });
      }

      if (!vocabulary) {
        selectCategoryMsg.current.show({ severity: 'error', summary: 'Please Choose a Category' });
      }

      if (term.length < 1) {
        termMsg.current.show({ severity: 'error', summary: 'This field is mandatory' });
      }

      if (description.length < 1) {
        descriptionMsg.current.show({ severity: 'error', summary: 'This field is mandatory' });
      }
    }

    return valid;
  };

  const vocabularies = [
    { icon: 'fa-duotone fa-diagram-project', vocabulary: 'term', label: 'Variable/General Terms' },
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
            <InputText
              placeholder="Full Name"
              onChange={(e) => setFullname(e.target.value)}
              value={fullname}
            />
            <Tag icon="fa-duotone fa-asterisk" severity="danger" />
          </div>
        </div>
        <Messages ref={fullNameMsg} />
        <div className="col-12 md:col-4 p-mb-4">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="fa-duotone fa-envelope" />
            </span>
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e-mail"
            />
            <Tag icon="fa-duotone fa-asterisk" severity="danger" />
          </div>
          <Messages ref={emailMsg} />
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
              onChange={(e) => setVocabulary(e.target.value)}
              placeholder="Select a Category"
            />
            <Tag icon="fa-duotone fa-asterisk" severity="danger" />
          </div>
          <Messages ref={selectCategoryMsg} />
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
            <Tag icon="fa-duotone fa-asterisk" severity="danger" />
          </div>
          <Messages ref={termMsg} />
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
            <Tag icon="fa-duotone fa-asterisk" severity="danger" />
          </div>
          <Messages ref={descriptionMsg} />
        </div>
        <div className="col-12 md:col-4 p-mb-4">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="fa-duotone fa-link" />
            </span>
            <InputText
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Reference"
            />
            <Tag icon="fa-duotone fa-info" severity="info" />
          </div>
        </div>
        <div className="card">
          <Captcha siteKey="6LcClrYgAAAAAMl0Aa0ayfVGailNnWLbGviLcxTI" type="invisible" onResponse={showResponse} />
        </div>
        <div className="col-12 md:col-4 p-mb-4">
          <Button
            label="Submit"
            loading={loading}
            onClick={onLoadingClick}
            iconPos="right"
          />
        </div>
      </div>
      <Dialog
        header="Success!"
        visible={displayModal}
        style={{ width: '50vw' }}
        onHide={() => onHide()}
      >
        <p> Your term has been submitted!</p>
      </Dialog>
    </Card>
  );
};

export default SubmitTerm;
