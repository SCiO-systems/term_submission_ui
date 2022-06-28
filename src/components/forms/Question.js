import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { ContextMenu } from 'primereact/contextmenu';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Messages } from 'primereact/messages';
import { SelectButton } from 'primereact/selectbutton';
import { Fieldset } from 'primereact/fieldset';
import { AutoComplete } from 'primereact/autocomplete';
import { MultiStateCheckbox } from 'primereact/multistatecheckbox';
import { Toolbar } from 'primereact/toolbar';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { PickList } from 'primereact/picklist';
import { Divider } from 'primereact/divider';
import { Tooltip } from 'primereact/tooltip';
import { InputMask } from 'primereact/inputmask';
import { BlockUI } from 'primereact/blockui';
import NodeService from '../../services/NodeService';

const Question = (props) => {
  const [test, setTest] = useState(null);
  const [multiselectValue, setMultiselectValue] = useState(null);
  const [displayMaximizable, setDisplayMaximizable] = useState(false);
  const [displaySelect, setDisplaySelect] = useState(false);
  const [costs, setCosts] = useState([{ name: '', label: '', id: Math.floor(Math.random() * 1000) }]);
  const [editingCellRows, setEditingCellRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [position, setPosition] = useState('center');
  const [readOnly, setReadOnly] = useState(false);
  const [required, setRequired] = useState(false);
  const [repeating, setRepeating] = useState(false);
  const [multiple, setMultiple] = useState('Single');
  const [typeDropdownValues, setTypeDropdownValues] = useState(null);
  const [typeSelect, setTypeSelect] = useState(null);
  const [styleDropdownValues, setStyleDropdownValues] = useState(null);
  const [styleSelect, setStyleSelect] = useState(null);

  // Mode
  const [mode, setMode] = useState(null);

  // Values
  const [valueLabel, setValueLabel] = useState(undefined);
  const [valueName, setValueName] = useState(undefined);
  const [valueHint, setValueHint] = useState(undefined);
  const [valueDefault, setValueDefault] = useState(undefined);
  const [valueMin, setValueMin] = useState(undefined);
  const [valueMax, setValueMax] = useState(undefined);

  const [valueCalculation, setValueCalculation] = useState(undefined);
  const [valueCondition, setValueCondition] = useState(undefined);
  const [valueConstraint, setValueConstraint] = useState(null);
  const [valueConstraintMessage, setValueConstraintMessage] = useState(null);

  // Autocomplete Semantics
  const [valueSemantics, setValueSemantics] = useState(undefined);
  const [suggestedSemantics, setSuggestedSemantics] = useState(undefined);
  const [disableAddSearch, setDisableAddSearch] = useState(true);

  // Autocomplete Units
  const [valueUnits, setValueUnits] = useState(undefined);
  const [suggestedUnits, setSuggestedUnits] = useState(undefined);

  // Date Range
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  // Range Inclusive
  const [minInclusive, setMinInclusive] = useState(false);
  const [maxInclusive, setMaxInclusive] = useState(false);

  const minOptions = [
    { value: false, icon: 'fa-solid fa-bracket-round' },
    { value: true, icon: 'fa-solid fa-bracket-square' },
  ];

  const maxOptions = [
    { value: false, icon: 'fa-solid fa-bracket-round-right' },
    { value: true, icon: 'fa-solid fa-bracket-square-right' },
  ];

  // Save Button State
  const [labelHasContent, setLabelHasContent] = useState(false);
  const [nameHasContent, setNameHasContent] = useState(false);
  const [typeHasContent, setTypeHasContent] = useState(false);

  const msgsLabel = useRef(null);
  const msgsName = useRef(null);

  // Property Variables
  const [header, setHeader] = useState(null);
  const [questionId, setQuestionId] = useState(null);

  // Internal State
  const [visible, setVisible] = useState(false);

  // Output
  const [output, setOutput] = useState({});

  // Datatable State Variables
  const [choices, setChoices] = useState([]);
  const cm = useRef(null);
  const [valueChoicesLabel, setValueChoicesLabel] = useState(null);
  const [valueChoicesName, setValueChoicesName] = useState(null);
  const [deleteChoiceEntry, setDeleteChoiceEntry] = useState(false);
  const [choice, setChoice] = useState(null);
  const [listName, setListName] = useState(null);

  // Matching Queries
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [searchPopup, setSearchPopup] = useState(null);
  const [blockedMatchingQueries, setBlockedMatchingQueries] = useState(false);

  // Keywords Datatable

  const [extractedTerms, setExtractedTerms] = useState(null);
  const [extractedTerm, setExtractedTerm] = useState(false);
  const [selectedExtractedTerms, setSelectedExtractedTerms] = useState(null);
  const [deleteExtractedTerms, setDeleteExtractedTerms] = useState(false);
  const [deleteTermDialog, setDeleteTermDialog] = useState(false);
  const [deleteTermsDialog, setDeleteTermsDialog] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [displayKeywordsSearch, setDisplayKeywordsSearch] = useState(null);
  const [displayAddChoices, setDisplayAddChoices] = useState(null);
  const [extractPopup, setExtractPopup] = useState(null);
  const [vocabularyOptions, setVocabularyOptions] = useState(null);
  const [selectedVocabulary, setSelectedVocabulary] = useState(null);
  const [searchTermDisabled, setSearchTermDisabled] = useState(true);

  const toast = useRef(null);

  // let vocabularies = null;

  const onVocabularyChange = (e) => {
    if (e.value) {
      setSelectedVocabulary(e.value);
      setSearchTermDisabled(false);
    } else {
      setSearchTermDisabled(true);
    }
  };

  const [loading, setLoading] = useState(true);

  // Matching Quereis

  // Semantics Datatable
  const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i += 1) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const hideDeleteTermDialog = () => {
    setDeleteTermDialog(false);
  };

  const hideDeleteTermsDialog = () => {
    setDeleteTermsDialog(false);
  };

  const confirmDeleteTermRecord = (termRecord) => {
    setExtractedTerm(termRecord);
    setDeleteTermDialog(true);
  };

  const confirmDeleteSelectedTerms = () => {
    setDeleteTermsDialog(true);
  };

  const deleteSelectedTerms = () => {
    const tempExtractedTerms =
      extractedTerms.filter((val) => !selectedExtractedTerms.includes(val));
    setExtractedTerms(tempExtractedTerms);
    setDeleteTermsDialog(false);
    setSelectedExtractedTerms(null);
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Terms Deleted', life: 3000 });
  };

  const deleteTermRecord = () => {
    const tempExtractedTerms = extractedTerms.filter((val) => val.id !== extractedTerm.id);
    setExtractedTerms(tempExtractedTerms);
    setDeleteExtractedTerms(false);
    setExtractedTerm({ id: null, term: '', scheme: '', description: '' });
    setDeleteTermDialog(false);
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Term Deleted', life: 3000 });
  };

  const deleteTermDialogFooter = (
    <>
      <Button label="No" icon="fa-duotone fa-xmark" className="p-button-text p-button-success mr-2" onClick={hideDeleteTermDialog} />
      <Button label="Yes" icon="fa-duotone fa-trash" className="p-button-danger" onClick={deleteTermRecord} />
    </>
  );

  const deleteTermsDialogFooter = (
    <>
      <Button label="No" icon="fa-duotone fa-xmark" className="p-button-text p-button-success mr-2" onClick={hideDeleteTermsDialog} />
      <Button label="Yes" icon="fa-duotone fa-trash" className="p-button-danger" onClick={deleteSelectedTerms} />
    </>
  );

  const actionBodyTemplate = (termRecord) => (
    <Button
      icon="fa-duotone fa-trash"
      className="p-button-danger"
      onClick={() => confirmDeleteTermRecord(termRecord)}
    />
  );

  const leftToolbarTemplate = () => (
    <>
      <Button
        label="Add"
        icon="fa-duotone fa-plus"
        className="p-button-success p-mr-2"
        onClick={() => {
          setExtractedTerm({ id: null, term: '', scheme: '', description: '' });
          setSubmitted(false);
          setDisplayKeywordsSearch(true);
        }}
      />
      <Button
        label="Delete"
        icon="fa-duotone fa-trash"
        className="p-button-danger"
        onClick={confirmDeleteSelectedTerms}
        disabled={!selectedExtractedTerms || !selectedExtractedTerms.length}
      />
    </>
  );

  const rightToolbarTemplate = () => {
    const accept = () => {
      setLoading(true);
      const ns = new NodeService();
      ns.getExtractedKeywords(valueLabel)
        .then(
          (data) => {
            const tempExtractedTerms = data.map(
              (item) => {
                // eslint-disable-next-line no-param-reassign
                item.uri = item.id;
                // eslint-disable-next-line no-param-reassign
                item.id = createId();
                return item;
              }
            );
            setLoading(false);
            const mergedExtractedTerms = [...extractedTerms, ...tempExtractedTerms];
            setExtractedTerms([...mergedExtractedTerms]);
          }
        ).catch(
          (data) => console.log(data)
        );

      toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Success', life: 3000 });
    };

    const reject = () => {
      toast.current.show({ severity: 'info', summary: 'Rejected', detail: '', life: 3000 });
    };
    return (
      <>
        <Toast ref={toast} />
        <ConfirmPopup
          target={document.getElementById('extract')}
          visible={extractPopup}
          onHide={() => setExtractPopup(false)}
          message="Are you sure you want to proceed?"
          icon="fa-duotone fa-triangle-exclamation"
          accept={accept}
          reject={reject}
        />
        <Button
          id="extract"
          onClick={() => accept()}
          label="Extract Keywords"
          icon="fa-duotone fa-wand-sparkles"
          className="p-button-secondary"
          disabled={!(valueLabel && valueLabel.length > 3)}
        />
      </>
    );
  };

  const rightMatchingToolbarTemplate = () => {
    const accept = () => {
      setBlockedMatchingQueries(true);
      // setLoading(true);
      const ns = new NodeService();
      ns.getQuestions(valueLabel)
        .then(
          (data) => {
            const matchedIDs = target.map(
              (matchedQuestion) => matchedQuestion.es_id
            );

            const filteredData = data.filter((item) => matchedIDs.indexOf(item.es_id) === -1);
            setSource(filteredData);
            setBlockedMatchingQueries(false);
            toast.current.show({ severity: 'info', summary: 'Matching Questions', detail: 'Success', life: 3000 });
          }
        ).catch(
          (data) => console.log(data)
        );
    };

    const reject = () => {
      toast.current.show({ severity: 'info', summary: 'Rejected', detail: '', life: 3000 });
    };

    return (
      <>
        <Toast ref={toast} />
        <ConfirmPopup
          target={document.getElementById('search')}
          visible={searchPopup}
          onHide={() => setSearchPopup(false)}
          message="Are you sure you want to proceed?"
          icon="fa-duotone fa-triangle-exclamation"
          accept={accept}
          reject={reject}
        />
        <Button
          id="search"
          onClick={() => accept()}
          label="SearchTerm Questions"
          icon="fa-duotone fa-wand-sparkles"
          className="p-button-secondary"
          disabled={!(valueLabel && valueLabel.length > 3)}
        />
      </>
    );
  };

  const addKeyword = () => {
    setSubmitted(true);

    const tempExtractedTerms = extractedTerms;
    tempExtractedTerms.push(valueSemantics);
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Term Added', life: 3000 });

    setExtractedTerms(tempExtractedTerms);
    setDisplayKeywordsSearch(false);
    setExtractedTerm({ id: null, term: '', scheme: '', description: '' });
  };

  const renderFooterKeywordSearch = () => (
    <div>
      <Button
        label="Cancel"
        icon="fa-duotone fa-xmark"
        onClick={() => setDisplayKeywordsSearch(false)}
        className="p-button-text p-button-danger"
      />
      <Button
        label="Add"
        icon="fa-duotone fa-plus"
        onClick={() => { addKeyword(); }}
        className="p-button-success"
        autoFocus
        disabled={disableAddSearch}
      />
    </div>
  );

  const menuModel = [
    { label: 'Add Choice', icon: 'fa-duotone fa-pencil', command: () => addRow(selectedRow) },
    { label: 'Delete Choice', icon: 'fa-duotone fa-eraser', command: () => deleteRow(selectedRow) },
  ];

  const addMessages = (message, id) => {
    if (id === 'label') {
      msgsLabel.current.show([
        message,
      ]);
    } else if (id === 'name') {
      msgsName.current.show([
        message,
      ]);
    }
  };

  useEffect(() => {
    // Keywords Datatable
    setExtractedTerms([]);
    setLoading(false);

    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      const { configuration } = props;
      setQuestionId(configuration.general_properties.id);
      setHeader(configuration.general_properties.header);
      // eslint-disable-next-line react/destructuring-assignment
      setVisible(props.show);
      // eslint-disable-next-line react/destructuring-assignment
      setTypeDropdownValues(props.configuration.basic_properties.type.dropdownValues);
      // eslint-disable-next-line react/destructuring-assignment
      setStyleDropdownValues(props.configuration.basic_properties.style.dropdownValues);

      // eslint-disable-next-line react/destructuring-assignment
      if (props.configuration.basic_properties.type.enabled) {
        setTypeHasContent(false);
      } else {
        setTypeHasContent(true);
      }

      // eslint-disable-next-line react/destructuring-assignment
      if (props.data) {
        const { data } = props;
        setValueLabel(data.label);
        setValueName(data.name);
        setValueHint(data.hint);
        setValueDefault(data.default);
        setLabelHasContent(true);
        setNameHasContent(true);
        setReadOnly(data.read_only);
        setRequired(data.required);
        setValueConstraint(data.constraint);
        setValueMin(data.min);
        setValueMax(data.max);
        setDateFrom(data.range_date_from);
        setDateTo(data.range_date_to);
        setListName(data.listname);
        setChoices([]);
        setTarget([]);
        // setTypeHasContent(true);
        // setTypeSelect(struct.value);

        if (data.choices) {
          setChoices(data.choices);
        }

        if (data.matching_questions) {
          setTarget(data.matching_questions);
        }

        if (data.listname) {
          setListName(data.listname);
        }

        if (data.min) {
          setMinInclusive(data.min_inclusive);
        }

        if (data.max) {
          setMaxInclusive(data.max_inclusive);
        }

        if (data.range_date_from) {
          setMinInclusive(data.min_from_inclusive);
        }

        if (data.range_date_to) {
          setMaxInclusive(data.max_to_inclusive);
        }

        /* if (data.range_date) {
          const dateObject = data.range_date.map(
            (dateItem) => new Date(dateItem)
          );
          setDateRange(dateObject);
        } */

        if (data.style) {
          setStyleSelect(data.style);
        }

        if (data.type) {
          setTypeSelect(data.type);
          setTypeHasContent(true);
        }

        if (data.constraint_message) {
          setValueConstraintMessage(data.constraint_message);
        }

        if (data.condition) {
          setValueCondition(data.condition);
        }

        if (data.calculation) {
          setValueCalculation(data.calculation);
        }

        if (data.semantics) {
          setExtractedTerms(data.semantics);
        }

        if (data.unit) {
          setValueUnits(data.unit);
        }

        // eslint-disable-next-line react/destructuring-assignment
        setOutput({ ...data });
      } else {
        setLabelHasContent(false);
        setNameHasContent(false);
        setMinInclusive(false);
        setMaxInclusive(false);
        setRequired(false);
        setReadOnly(false);
        setRepeating(false);
        setMultiple('Single');
        setStyleSelect(null);
        setTypeSelect(null);

        // eslint-disable-next-line react/destructuring-assignment
        setOutput({});
      }
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (props.mode) {
      // eslint-disable-next-line react/destructuring-assignment
      setMode(props.mode);
    }
    // eslint-disable-next-line react/destructuring-assignment
    if (props.vocabularies) {
      const { vocabularies } = props;
      setVocabularyOptions(vocabularies);
    }
  }, [props.show]); // eslint-disable-line

  const updateOutput = (struct) => {
    if (struct.id === 'label') {
      if (struct.value.length === 0) {
        setLabelHasContent(false);
        setValueLabel(struct.value);
        addMessages({ severity: 'error', summary: '', detail: 'The question narrative is mandatory', sticky: true }, struct.id);
      } else {
        setLabelHasContent(true);
        setValueLabel(struct.value);
        msgsLabel.current.clear();
      }
    }

    if (struct.id === 'name') {
      if (struct.value.length === 0) {
        setNameHasContent(false);
        setValueName(struct.value);
        addMessages({ severity: 'error', summary: '', detail: 'The column name is mandatory', sticky: true }, struct.id);
      } else {
        // eslint-disable-next-line no-param-reassign
        struct.value = struct.value.split(' ').join('_');
        setNameHasContent(true);
        setValueName(struct.value);
        msgsName.current.clear();
      }
    }

    const tempOutput = output;
    tempOutput[struct.id] = struct.value;

    if (struct.id === 'hint') {
      setValueHint(struct.value);
    }

    if (struct.id === 'range_date_from') {
      setDateFrom(struct.value);
      if (dateTo) {
        let noEqualMin = '>';
        let noEqualMax = '<';

        if (minInclusive) {
          noEqualMin = '>=';
        }
        if (maxInclusive) {
          noEqualMax = '<=';
        }

        const rangeExpression = `(.${noEqualMin}date('${struct.value}')) and (.${noEqualMax}date('${dateTo}'))`;
        tempOutput.constraint = rangeExpression;
        setValueConstraint(rangeExpression);
      }
    }

    if (struct.id === 'range_date_to') {
      setDateTo(struct.value);

      if (dateFrom) {
        let noEqualMin = '>';
        let noEqualMax = '<';

        if (minInclusive) {
          noEqualMin = '>=';
        }
        if (maxInclusive) {
          noEqualMax = '<=';
        }

        const rangeExpression = `(.${noEqualMin}date('${dateFrom}')) and (.${noEqualMax}date('${struct.value}'))`;
        tempOutput.constraint = rangeExpression;
        setValueConstraint(rangeExpression);
      }
    }

    if (struct.id === 'default') {
      setValueDefault(struct.value);
    }

    if (struct.id === 'type') {
      setTypeHasContent(true);
      setTypeSelect(struct.value);
    }

    if (struct.id === 'style') {
      setStyleSelect(struct.value);
    }

    if (struct.id === 'min_from_inclusive') {
      if (struct.value === null) {
        setMinInclusive(false);
        tempOutput.min_from_inclusive = false;
      } else {
        setMinInclusive(struct.value);
        if ((dateFrom) && (dateTo)) {
          let noEqualMin = '>';
          if (struct.value) {
            noEqualMin = '>=';
          }
          let noEqualMax = '<';
          if (maxInclusive) {
            noEqualMax = '=<';
          }

          const rangeExpression = `(.${noEqualMin}date('${dateFrom}')) and (.${noEqualMax}date('${dateTo}'))`;
          setValueConstraint(rangeExpression);
          tempOutput.constraint = rangeExpression;
        }

        tempOutput.min_from_inclusive = struct.value;
      }
    }

    if (struct.id === 'max_to_inclusive') {
      if (struct.value === null) {
        setMaxInclusive(false);
        tempOutput.max_to_inclusive = false;
      } else {
        setMaxInclusive(struct.value);
        if ((dateFrom) && (dateTo)) {
          let noEqualMin = '>';
          if (struct.value) {
            noEqualMin = '>=';
          }
          let noEqualMax = '<';
          if (maxInclusive) {
            noEqualMax = '=<';
          }

          const rangeExpression = `(.${noEqualMin}date('${dateFrom}')) and (.${noEqualMax}date('${dateTo}'))`;
          setValueConstraint(rangeExpression);
          tempOutput.constraint = rangeExpression;
        }

        tempOutput.max_to_inclusive = struct.value;
      }
    }

    if (struct.id === 'min_inclusive') {
      if (struct.value === null) {
        setMinInclusive(false);
        tempOutput.min_inclusive = false;
      } else {
        setMinInclusive(struct.value);
        if ((valueMax) && (valueMin)) {
          let noEqualMin = '>';
          if (struct.value) {
            noEqualMin = '>=';
          }
          let noEqualMax = '<';
          if (maxInclusive) {
            noEqualMax = '=<';
          }

          const rangeExpression = `(.${noEqualMin}${valueMin}) and (.${noEqualMax}${valueMax})`;
          setValueConstraint(rangeExpression);
          tempOutput.constraint = rangeExpression;
        }

        tempOutput.min_inclusive = struct.value;
      }
    }

    if (struct.id === 'max_inclusive') {
      if (struct.value === null) {
        setMaxInclusive(false);
        tempOutput.max_inclusive = false;
      } else {
        setMaxInclusive(struct.value);
        if ((valueMax) && (valueMin)) {
          let noEqualMin = '>';
          if (minInclusive) {
            noEqualMin = '>=';
          }
          let noEqualMax = '<';
          if (struct.value) {
            noEqualMax = '=<';
          }

          const rangeExpression = `(.${noEqualMin}${valueMin}) and (.${noEqualMax}${valueMax})`;
          tempOutput.constraint = rangeExpression;
          setValueConstraint(rangeExpression);
        }
        tempOutput.max_inclusive = struct.value;
      }
    }

    if (struct.id === 'constraint') {
      setValueConstraint(struct.value);
    }

    if (struct.id === 'constraint_message') {
      setValueConstraintMessage(struct.value);
    }

    if (struct.id === 'condition') {
      setValueCondition(struct.value);
    }

    if (struct.id === 'calculation') {
      setValueCalculation(struct.value);
    }

    if (struct.id === 'unit') {
      setValueUnits(struct.value);
    }

    if (struct.id === 'semantics') {
      if (struct.value === null) {
        setDisableAddSearch(true);
      }

      setValueSemantics(struct.value);
    }

    if (struct.id === 'min') {
      setValueMin(struct.value);
      if (valueMax) {
        let noEqualMin = '>';
        if (minInclusive) {
          noEqualMin = '>=';
        }
        let noEqualMax = '<';
        if (maxInclusive) {
          noEqualMax = '<=';
        }

        const rangeExpression = `(.${noEqualMin}${struct.value}) and (.${noEqualMax}${valueMax})`;
        tempOutput.constraint = rangeExpression;
        tempOutput.min_inclusive = minInclusive;
        tempOutput.max_inclusive = maxInclusive;
        setValueConstraint(rangeExpression);
      }
    }

    if (struct.id === 'max') {
      setValueMax(struct.value);
      if (valueMin) {
        let noEqualMin = '>';
        if (minInclusive) {
          noEqualMin = '>=';
        }
        let noEqualMax = '<';
        if (maxInclusive) {
          noEqualMax = '<=';
        }
        const rangeExpression = `(.${noEqualMin}${valueMin}) and (.${noEqualMax}${struct.value})`;
        tempOutput.constraint = rangeExpression;
        tempOutput.min_inclusive = minInclusive;
        tempOutput.max_inclusive = maxInclusive;
        setValueConstraint(rangeExpression);
      }
    }

    setOutput({ ...tempOutput });
  };

  const saveQuestion = () => {
    const tempOutput = output;
    tempOutput.id = questionId;

    if (required) {
      tempOutput.required = true;
    } else {
      tempOutput.required = false;
    }

    if (readOnly) {
      tempOutput.read_only = true;
    } else {
      tempOutput.read_only = false;
    }

    tempOutput.mode = mode;

    // eslint-disable-next-line react/destructuring-assignment
    if (mode === 'update') {
      // eslint-disable-next-line react/destructuring-assignment
      tempOutput.key = props.data.key;
    }

    // console.log(tempOutput);
    tempOutput.semantics = extractedTerms;
    tempOutput.choices = choices;
    tempOutput.listname = listName;
    tempOutput.multiple = multiple;
    tempOutput.matching_questions = target;

    // eslint-disable-next-line react/destructuring-assignment
    props.output(tempOutput);

    setVisible(false);
  };

  const cancelQuestion = () => {
    // eslint-disable-next-line react/destructuring-assignment
    props.output(null);
    setVisible(false);
  };

  // Datatable Functions
  const deleteRow = (row) => {
    // eslint-disable-next-line no-underscore-dangle
    let tempChoices = [...choices];
    tempChoices = tempChoices.filter((p) => p.id !== row.id);
    setChoices(tempChoices);
  };

  const addRow = () => {
    // eslint-disable-next-line no-underscore-dangle
    const tempRow =
      {
        name: '',
        label: '',
        id: Math.floor(Math.random() * 1000),
      };

    // eslint-disable-next-line no-underscore-dangle
    const tempChoices = [...choices];
    tempChoices.push(tempRow);
    setChoices(tempChoices);
  };

  // eslint-disable-next-line no-shadow
  const onEditorValueChange = (props, value) => {
    // eslint-disable-next-line react/destructuring-assignment
    const updatedProducts = [...props.value];
    // eslint-disable-next-line react/destructuring-assignment
    updatedProducts[props.rowIndex][props.field] = value;
    setChoices(updatedProducts);
  };

  const onEditorInit = (e) => {
    const { rowIndex: index, field, rowData } = e.columnProps;
    // eslint-disable-next-line no-underscore-dangle
    const _editingCellRows = [...editingCellRows];
    if (!editingCellRows[index]) {
      _editingCellRows[index] = { ...rowData };
    }
    _editingCellRows[index][field] = costs[index][field];
    setEditingCellRows(_editingCellRows);
  };

  const onEditorCancel = (e) => {
    const { rowIndex: index, field } = e.columnProps;
    // eslint-disable-next-line no-shadow
    const products = [...costs];
    // eslint-disable-next-line no-underscore-dangle
    const _editingCellRows = [...editingCellRows];
    products[index][field] = _editingCellRows[index][field];
    delete _editingCellRows[index][field];
    setEditingCellRows(_editingCellRows);
    setChoices(products);
  };

  const onEditorSubmit = (e) => {
    const { rowIndex: index, field } = e.columnProps;
    // eslint-disable-next-line no-underscore-dangle
    const _editingCellRows = [...editingCellRows];
    delete _editingCellRows[index][field];
    setEditingCellRows(_editingCellRows);
  };

  // eslint-disable-next-line no-shadow
  const inputTextEditor = (propsLocal) => (
    <InputText
      type="text"
      className="p-inputtext-sm"
      placeholder={propsLocal.field}
      value={propsLocal.rowData[propsLocal.field]}
      onChange={(e) => onEditorValueChange(propsLocal, e.target.value)}
    />
  );

  const placeholderTemplate = (data, propsLocal) => {
    let variable = '';
    if (propsLocal.rowData[propsLocal.field] !== '') {
      variable = propsLocal.rowData[propsLocal.field];
    }
    return (
      <span>{variable}</span>
    );
  };

  const itemTemplate = (item) => (
    <>
      <div className="" style={{ maxWidth: '200px' }}>
        {/* eslint-disable-next-line no-return-assign */}
        <div><strong>{item.term}</strong></div>
        <div><span style={{ whiteSpace: 'normal' }}>{item.description}</span></div>
      </div>
      <Divider />
    </>
  );

  const unitTemplate = (item) => (
    <>
      <div className="" style={{ height: '60px', width: '200px' }}>
        {/* eslint-disable-next-line no-return-assign */}
        <div><strong>{item.term}</strong></div>
        <div><span style={{ whiteSpace: 'normal' }}>{item.description}</span></div>
      </div>
      <Divider />
    </>
  );

  const autocompleteSemantics = (event) => {
    const ns = new NodeService();
    ns.getSemanticSuggestions(selectedVocabulary.code, event.query)
      .then(
        (data) => {
          const tempSuggestedSemantics = data;
          if (data.length) {
            setSuggestedSemantics([...tempSuggestedSemantics]);
          } else {
            setSuggestedSemantics([]);
          }
        }
      ).catch(
        (data) => console.log(data)
      );
  };

  const autocompleteUnits = (event) => {
    const ns = new NodeService();
    ns.getUnitSuggestions(event.query)
      .then(
        (data) => {
          const tempSuggestedUnits = data;
          if (data.length) {
            setSuggestedUnits([...tempSuggestedUnits]);
          } else {
            setSuggestedUnits([]);
          }
        }
      ).catch(
        (data) => console.log(data)
      );
  };

  const renderDatatable = () => {
    const actionBodyChoiceTemplate = (rowData) => {
      const accept = () => {
        deleteRow(rowData);
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Success', life: 3000 });
      };

      const reject = () => {
        toast.current.show({ severity: 'info', summary: 'Rejected', detail: '', life: 3000 });
      };

      return (
        <>
          <ConfirmPopup
            target={document.getElementById(`delete_button_${rowData.id}`)}
            visible={deleteChoiceEntry[rowData.id]}
            onHide={
             () => {
               const tempDeleteChoiceEntry = deleteChoiceEntry;
               tempDeleteChoiceEntry[rowData.id] = false;
               setDeleteChoiceEntry(tempDeleteChoiceEntry);
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
            onClick={() => {
              setChoice(rowData);
              setValueChoicesLabel(rowData.label);
              setValueChoicesName(rowData.name);
              setDisplayAddChoices(true);
            }
            }
          />

          <Button
            id={`delete_button_${rowData.id}`}
            icon="fa-duotone fa-trash"
            className="p-button-danger"
            onClick={() => {
              const tempDeleteChoiceEntry = deleteChoiceEntry;
              tempDeleteChoiceEntry[rowData.id] = true;
              setDeleteChoiceEntry({ ...tempDeleteChoiceEntry });
            }}
          />
        </>

      );
    };

    const findIndexById = (id) => {
      let index = -1;
      for (let i = 0; i < choices.length; i += 1) {
        if (choices[i].id === id) {
          index = i;
          break;
        }
      }

      return index;
    };

    const saveChoice = () => {
      setSubmitted(true);

      const tempChoices = [...choices];
      if (choice) {
        const index = findIndexById(choice.id);
        choice.name = valueChoicesName;
        choice.label = valueChoicesLabel;
        tempChoices[index] = choice;
        setChoices(tempChoices);
        setValueChoicesLabel(null);
        setValueChoicesName(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Choice Updated', life: 3000 });
      } else {
        const tempRow =
          {
            name: valueChoicesName,
            label: valueChoicesLabel,
            id: createId(),
          };

        tempChoices.push(tempRow);
        setChoices(tempChoices);
        setValueChoicesLabel(null);
        setValueChoicesName(null);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Choice Added', life: 3000 });
        setDisplayAddChoices(false);
        let delete_ids_list = deleteChoiceEntry;
        if (delete_ids_list) {
          delete_ids_list[tempRow.id] = false;
        } else {
          delete_ids_list = {};
          delete_ids_list[tempRow.id] = false;
        }
        setDeleteChoiceEntry(delete_ids_list);
      }

      setDisplayAddChoices(false);
      setChoice(null);
    };

    const renderFooterKeywordChoice = () => (
      <div>
        <Button
          label="Cancel"
          icon="fa-duotone fa-xmark"
          onClick={() => setDisplayAddChoices(false)}
          className="p-button-text p-button-danger"
        />
        <Button
          label="Add"
          icon="fa-duotone fa-plus"
          onClick={() => { saveChoice(); }}
          className="p-button-success"
          autoFocus
        />
      </div>
    );

    const leftChoicesDatatable = () => (
      <>
        <Button
          label="Add"
          icon="fa-duotone fa-plus"
          className="p-button-success p-mr-2"
          onClick={() => {
            setDisplayAddChoices(true);
          }}
        />
      </>
    );

    const rightChoicesDatatable = () => (
      <div className="p-inputgroup">
        <Button
          label="List Name"
          tooltip="Please provide a name to your list"
          tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
        />
        <InputText
          keyfilter="alphanum"
          value={listName}
          id="list_name"
          onChange={(e) => setListName(e.target.value)}
          autocomplete="off"
        />
      </div>
    );

    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line react/destructuring-assignment
      const hasDatatable = props.configuration.basic_properties.datatable.enabled;
      if (hasDatatable) {
        return (
          <div className="card">
            <Dialog
              header="Add/Update a Choice"
              visible={displayAddChoices}
              style={{ width: '50vw' }}
              footer={renderFooterKeywordChoice()}
              onHide={() => setDisplayAddChoices(false)}
            >
              <div className="p-grid p-fluid">
                <div className="p-col-12 p-md-6">
                  <Button
                    label="Label"
                    tooltip="Your question in natural language"
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                  />
                  <InputText
                    value={valueChoicesLabel}
                    id="choices_label"
                    placeholder=""
                    onChange={(e) => setValueChoicesLabel(e.target.value)}
                    autocomplete="off"
                  />
                </div>
                <div className="p-col-12 p-md-6">
                  <Button
                    label="Name"
                    tooltip="Provide a name for your list"
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                  />
                  <InputText
                    value={valueChoicesName}
                    id="choices_name"
                    placeholder=""
                    onChange={(e) => setValueChoicesName(e.target.value)}
                    autocomplete="off"
                  />
                </div>
              </div>
            </Dialog>
            <h5>Choices</h5>
            <Toolbar className="mb-4" left={leftChoicesDatatable} right={rightChoicesDatatable} className="p-mb-4" />
            <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedRow(null)} />
            <DataTable
              value={choices}
              paginator
              className="p-datatable-customers"
              editMode="row"
              rows={10}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              rowsPerPageOptions={[10, 25, 50]}
              dataKey="id"
              rowHover
              responsiveLayout="scroll"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              contextMenuSelection={selectedRow}
              onContextMenuSelectionChange={(e) => setSelectedRow(e.value)}
              onContextMenu={(e) => cm.current.show(e.originalEvent)}
              emptyMessage="No entries found."
              size="small"
            >
              <Column
                field="label"
                header="Label"
                sortable
                style={{ minWidth: '30rem' }}
                editor={(propsLocal) => inputTextEditor(propsLocal)}
                onEditorInit={onEditorInit}
                onEditorCancel={onEditorCancel}
                onEditorSubmit={onEditorSubmit}
                body={(data, propsLocal) => placeholderTemplate(data, propsLocal)}
              />
              <Column
                field="name"
                header="Name"
                sortable
                editor={(propsLocal) => inputTextEditor(propsLocal)}
                onEditorInit={onEditorInit}
                onEditorCancel={onEditorCancel}
                onEditorSubmit={onEditorSubmit}
                body={(data, propsLocal) => placeholderTemplate(data, propsLocal)}
              />
              <Column body={actionBodyChoiceTemplate} exportable={false} style={{ minWidth: '8rem' }} />
            </DataTable>
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderFooter = () => {
    let labelButton;
    let iconButton;
    if (mode === 'new') {
      labelButton = 'Create';
      iconButton = 'fa-duotone fa-check';
    } else if (mode === 'update') {
      labelButton = 'Update';
      iconButton = 'fa-duotone fa-arrow-rotate-right';
    }

    return (
      <div className="p-mt-4">
        <Button
          label="Cancel"
          icon="fa-duotone fa-xmark"
          onClick={() => cancelQuestion()}
          className="p-button-text p-button-danger"
        />
        {/* eslint-disable-next-line react/destructuring-assignment */}
        <Button
          className="p-button-success"
          label={labelButton}
          icon={iconButton}
          onClick={() => saveQuestion()}
          disabled={!(labelHasContent && nameHasContent && typeHasContent)}
          autoFocus
        />
      </div>
    );
  };

  const renderLabel = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line react/destructuring-assignment
      const hasLabel = props.configuration.basic_properties.label.enabled;
      if (hasLabel) {
        return (
          <div className="p-col-12 p-md-12">
            <div className="p-inputgroup">
              <Button
                label="Question"
                tooltip="Your question in natural language"
                tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
              />
              <InputText
                value={valueLabel}
                id="label"
                placeholder=""
                onChange={(e) => updateOutput(e.target)}
                autocomplete="off"
              />
            </div>
            <Messages ref={msgsLabel} />
          </div>
        );
      }
      return <></>;
    }

    return <></>;
  };

  const renderName = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const hasName = props.configuration.basic_properties.name.enabled;
      if (hasName) {
        return (
          <div className="p-col-12 p-md-6">
            <div className="p-inputgroup">
              <Button
                label="Excel Column Name"
                tooltip="Name of the column in the exported data"
                tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
              />
              <InputText
                keyfilter="alphanum"
                autocomplete="off"
                value={valueName}
                id="name"
                placeholder=""
                onChange={(e) => updateOutput(e.target)}
              />
            </div>
            <Messages ref={msgsName} />
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderHint = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const hasHint = props.configuration.basic_properties.hint.enabled;
      if (hasHint) {
        return (
          <div className="p-col-12 p-md-12">
            <div className="p-inputgroup">
              <Button
                label="Hint"
                tooltip="Additional information for the person answering  the questionnaire"
                tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}

              />
              <InputText autocomplete="off" value={valueHint} id="hint" placeholder="" onChange={(e) => updateOutput(e.target)} />
            </div>
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderDefault = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const hasDefault = props.configuration.basic_properties.default.enabled;
      if (hasDefault) {
        return (
          <div className="p-col-12 p-md-6">
            <div className="p-inputgroup">
              <Button
                label="Default Value"
                tooltip="Pre-fill the response with a default value"
                tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
              />
              <InputText autocomplete="off" value={valueDefault} id="default" placeholder="" onChange={(e) => updateOutput(e.target)} />
            </div>
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderType = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const hasDefault = props.configuration.basic_properties.type.enabled;
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const hasUnit = props.configuration.basic_properties.type.unit;

      if (hasDefault && hasUnit) {
        return (
          <>
            <div className="p-col-12 p-md-6">
              <div>
                <Button label="Type" />
              </div>
              <Dropdown
                id="type"
                value={typeSelect}
                onChange={(e) => updateOutput(e.target)}
                options={typeDropdownValues}
                optionLabel="name"
                placeholder="Select"
              />
            </div>
            <div className="p-col-12 p-md-6">
              <div>
                <Button label="Unit" />
              </div>
              <div className="p-inputgroup">
                <AutoComplete
                  id="unit"
                  value={valueUnits}
                  field="term"
                  suggestions={suggestedUnits}
                  completeMethod={autocompleteUnits}
                  placeholder="Please start typing ..."
                  itemTemplate={unitTemplate}
                  onChange={(e) => updateOutput(e.target)}
                />
              </div>
            </div>
          </>
        );
      } if (hasDefault && !hasUnit) {
        return (
          <>
            <div className="p-col-12 p-md-6">
              <div>
                <Button label="Type" />
              </div>
              <Dropdown
                id="type"
                value={typeSelect}
                onChange={(e) => updateOutput(e.target)}
                options={typeDropdownValues}
                optionLabel="name"
                placeholder="Select"
              />
            </div>
          </>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderStyle = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const hasDefault = props.configuration.basic_properties.style.enabled;
      if (hasDefault) {
        return (
          <div className="p-col-12 p-md-6">
            <div>
              <Button label="Style" />
            </div>
            <Dropdown
              id="style"
              value={styleSelect}
              onChange={(e) => updateOutput(e.target)}
              options={styleDropdownValues}
              optionLabel="name"
              placeholder="Select"
            />
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderConstraint = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const hasConstraint = props.configuration.advanced_properties.constraint.enabled;
      if (hasConstraint) {
        return (
          <div className="p-grid p-fluid">
            <div className="p-col-12 p-md-6">
              <div className="p-inputgroup">
                <Tooltip target=".constrain-tooltip">
                  Use formulas to define the spectrum of meaningful answers for your question.
                  <br /> (click for more information)
                </Tooltip>
                <Button
                  className="constrain-tooltip"
                  label="Constraint"
                  onClick={() => window.open('https://docs.getodk.org/form-logic/#validating-and-restricting-responses', '_blank', 'noopener,noreferrer')}
                />
                <InputText
                  value={valueConstraint}
                  id="constraint"
                  placeholder=""
                  onChange={(e) => updateOutput(e.target)}
                />
              </div>
            </div>
            <div className="p-col-12 p-md-6">
              <div className="p-inputgroup">
                <Tooltip target=".constrain-message-tooltip">
                  Explain to the user why their recorded response was not acceptable.
                  <br /> (click for more information)
                </Tooltip>
                <Button
                  className="constrain-message-tooltip"
                  label="Constraint Message"
                  onClick={() => window.open('https://docs.getodk.org/form-logic/#validating-and-restricting-responses', '_blank', 'noopener,noreferrer')}
                />
                <InputText
                  value={valueConstraintMessage}
                  id="constraint_message"
                  placeholder=""
                  onChange={(e) => updateOutput(e.target)}
                />
              </div>
            </div>
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderCondition = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const hasCondition = props.configuration.advanced_properties.condition.enabled;
      if (hasCondition) {
        return (
          <div className="p-inputgroup">
            <Tooltip target=".relevant-tooltip">
              Define the conditions under which the question should appear,
              based on the values of other questions.
              <br /> (click for more information)
            </Tooltip>
            <Button
              className="relevant-tooltip"
              label="Relevant"
              onClick={() => window.open('https://docs.getodk.org/form-logic/#conditionally-showing-questions', '_blank', 'noopener,noreferrer')}
            />
            <InputText
              value={valueCondition}
              id="condition"
              placeholder=""
              onChange={(e) => updateOutput(e.target)}
            />
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderCalculation = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const hasCalculation = props.configuration.advanced_properties.calculation.enabled;
      if (hasCalculation) {
        return (
          <div className="p-inputgroup">
            <Tooltip target=".calculation-tooltip">
              Define the conditions under which the question should appear,
              based on the values of other questions.
              <br /> (click for more information)
            </Tooltip>
            <Button
              className="calculation-tooltip"
              label="Calculation"
              onClick={() => window.open('https://docs.getodk.org/form-logic/#calculations', '_blank', 'noopener,noreferrer')}
            />
            <InputText
              value={valueCalculation}
              id="calculation"
              placeholder=""
              onChange={(e) => updateOutput(e.target)}
            />
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderRepeating = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const isRepeating = props.configuration.basic_properties.repeating.enabled;
      if (isRepeating) {
        return (
          <>
            <div className="p-col-12 p-md-4">
              <Checkbox
                inputId="repeating"
                checked={repeating}
                onChange={(e) => setRepeating(e.checked)}
              />
              <label
                htmlFor="repeating"
                style={{ paddingLeft: '10px' }}
              >{repeating ? 'Loop' : 'Loop'}
              </label>
            </div>
            {repeating ? (
              <div className="p-col-12 p-md-12">
                <div className="p-inputgroup">
                  <Button label="Repeat Count" />
                  <InputText id="repeat_count" placeholder="" onChange={(e) => updateOutput(e.target)} />
                </div>
              </div>
            ) : console.log() }

          </>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderRange = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const isRepeating = props.configuration.basic_properties.range.enabled;
      if (isRepeating) {
        return (
          <>
            <div className="p-col-12 p-md-6">
              <div className="p-inputgroup">
                <Button label="Min Value" />
                <span className="p-inputgroup-addon">
                  <MultiStateCheckbox
                    id="min_inclusive"
                    value={minInclusive}
                    options={minOptions}
                    optionValue="value"
                    onChange={(e) => updateOutput(e.target)}
                  />
                </span>
                <InputNumber
                  value={valueMin}
                  id="min"
                  inputId="min"
                  onValueChange={(e) => updateOutput(e.target)}
                  mode="decimal"
                  autocomplete="off"
                />
              </div>
            </div>
            <div className="p-col-12 p-md-6">
              <div className="p-inputgroup">
                <Button label="Max Value" />
                <InputNumber
                  value={valueMax}
                  id="max"
                  inputId="max"
                  onValueChange={(e) => updateOutput(e.target)}
                  mode="decimal"
                />
                <span className="p-inputgroup-addon">
                  <MultiStateCheckbox
                    id="max_inclusive"
                    value={maxInclusive}
                    options={maxOptions}
                    optionValue="value"
                    onChange={(e) => updateOutput(e.target)}
                  />
                </span>
              </div>
            </div>
          </>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderCalendar = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line react/destructuring-assignment
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const hasCalendar = props.configuration.basic_properties.calendar.enabled;
      if (hasCalendar) {
        return (
          <>
            <div className="p-col-12 p-md-6">
              <div className="p-inputgroup">
                <Button label="From" />
                <span className="p-inputgroup-addon">
                  <MultiStateCheckbox
                    id="min_from_inclusive"
                    value={minInclusive}
                    options={minOptions}
                    optionValue="value"
                    onChange={(e) => updateOutput(e.target)}
                  />
                </span>
                <InputMask
                  keyfilter="alpha"
                  id="range_date_from"
                  mask="9999-99-99"
                  value={dateFrom}
                  slotChar="yyyy-mm-dd"
                  onChange={(e) => updateOutput(e.target)}
                />
              </div>
            </div>
            <div className="p-col-12 p-md-6">
              <div className="p-inputgroup">
                <Button label="To" />
                <InputMask
                  id="range_date_to"
                  mask="9999-99-99"
                  value={dateTo}
                  slotChar="yyyy-mm-dd"
                  onChange={(e) => updateOutput(e.target)}
                />
                <span className="p-inputgroup-addon">
                  <MultiStateCheckbox
                    id="max_to_inclusive"
                    value={maxInclusive}
                    options={maxOptions}
                    optionValue="value"
                    onChange={(e) => updateOutput(e.target)}
                  />
                </span>
              </div>
            </div>
          </>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderMultiple = () => {
    const options = ['Single', 'Multiple'];
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const isRepeating = props.configuration.basic_properties.multiple.enabled;
      if (isRepeating) {
        return (
          <div className="p-col-12 p-md-12">
            <SelectButton
              value={multiple}
              options={options}
              onChange={(e) => setMultiple(e.value)}
            />
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderAdvanced = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line react/destructuring-assignment
      const { hide } = props.configuration.advanced_properties;

      if (!hide) {
        return (
          <Fieldset legend="Advanced Properties" toggleable className="p-mt-4">
            <div className="p-col-12">
              {renderConstraint()}
            </div>
            <div className="p-col-12">
              {renderCondition()}
            </div>
            <div className="p-col-12">
              {renderCalculation()}
            </div>
          </Fieldset>
        );
      }
      return <></>;
    }
    return <></>;
  };

  const renderAnnotation = () => (
    <Fieldset legend="Semantics" toggleable className="p-mt-4">
      <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} className="p-mb-4" />
      <DataTable
        value={extractedTerms}
        paginator
        className="p-datatable-customers"
        rows={10}
        dataKey="id"
        rowHover
        selection={selectedExtractedTerms}
        onSelectionChange={(e) => setSelectedExtractedTerms(e.value)}
        loading={loading}
        responsiveLayout="scroll"
        emptyMessage="No terms found."
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        <Column field="term" header="Term" sortable style={{ minWidth: '14rem' }} />
        <Column field="description" header="Description" sortable style={{ minWidth: '14rem' }} />
        <Column field="scheme" header="Scheme" sortable style={{ minWidth: '14rem' }} />
        <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
      </DataTable>
      <Dialog
        header="SearchTerm Terms"
        visible={displayKeywordsSearch}
        style={{ width: '50vw' }}
        footer={renderFooterKeywordSearch()}
        onHide={() => setDisplayKeywordsSearch(false)}
      >
        <div className="p-grid p-fluid">
          <div className="p-col-12 p-md-6">
            <div>
              <Button label="Select Ontology" />
            </div>
            <div className="p-inputgroup">
              <Dropdown
                value={selectedVocabulary}
                options={vocabularyOptions}
                onChange={onVocabularyChange}
                optionLabel="scheme"
                placeholder="Select a Vocabulary"
                filter
                showClear
                filterBy="scheme"
              />
            </div>
          </div>
          <div className="p-col-12 p-md-6">
            <div>
              <Button label="SearchTerm Terms" />
            </div>
            <div className="p-inputgroup">
              <AutoComplete
                forceSelection
                disabled={searchTermDisabled}
                id="semantics"
                value={valueSemantics}
                field="term"
                suggestions={suggestedSemantics}
                completeMethod={autocompleteSemantics}
                placeholder="Please start typing ..."
                itemTemplate={itemTemplate}
                onChange={(e) => updateOutput(e.target)}
                onSelect={(e) => { setDisableAddSearch(false); }}
              />
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={deleteTermDialog}
        style={{ width: '450px' }}
        header="Confirm"
        modal
        footer={deleteTermDialogFooter}
        onHide={hideDeleteTermDialog}
      >
        <div className="confirmation-content">
          <i className="fa-duotone fa-triangle-exclamation mr-3" style={{ fontSize: '2rem' }} />
          {extractedTerm &&
            <span className="p-ml-3">Are you sure you want to delete <b>{extractedTerm.term}</b>?</span>}
        </div>
      </Dialog>
      <Dialog
        visible={deleteTermsDialog}
        style={{ width: '450px' }}
        header="Confirm"
        modal
        footer={deleteTermsDialogFooter}
        onHide={hideDeleteTermsDialog}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {extractedTerms && <span>Are you sure you want to delete the selected terms?</span>}
        </div>
      </Dialog>
    </Fieldset>
  );

  const renderMatchingQueries = () => {
    const onChange = (event) => {
      setSource(event.source);
      setTarget(event.target);
    };

    const itemTemplateQuery = (item) => {
      let questionText = '';
      let questionTextEn = '';

      if (item.label === item.label_en) {
        questionText = item.label;
      } else {
        questionText = item.label;
        questionTextEn = `( ${item.label_en} )`;
      }

      return (
        <div className="product-item">
          <div className="product-list-detail">
            <h4 className="mb-2">{`${questionText} `}</h4>
            <h5>{`${questionTextEn}`}</h5>
          </div>
        </div>
      );
    };

    return (
      <Fieldset legend="Matching Questions" toggleable className="p-mt-4">
        <Toolbar className="mb-4" right={rightMatchingToolbarTemplate} className="p-mb-4" />
        <div>
          <BlockUI blocked={blockedMatchingQueries}>
            <PickList
              source={source}
              target={target}
              itemTemplate={itemTemplateQuery}
              sourceHeader="Select questions that matches yours"
              targetHeader="Selected"
              sourceStyle={{ height: '342px' }}
              targetStyle={{ height: '342px' }}
              onChange={onChange}
            />
          </BlockUI>
        </div>
      </Fieldset>
    );
  };

  const renderReadOnly = () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (props.configuration) {
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const isRequired = props.configuration.basic_properties.required.enabled;
      // eslint-disable-next-line prefer-const,react/destructuring-assignment
      const isReadOnly = props.configuration.basic_properties.read_only.enabled;
      if (isRequired && isReadOnly) {
        return (
          <div className="p-col-12 p-md-6">
            <div className="p-col-12">
              <Checkbox
                inputId="readonly"
                checked={readOnly}
                onChange={(e) => setReadOnly(e.checked)}
              />
              <label
                htmlFor="readonly"
                style={{ paddingLeft: '10px' }}
              >{readOnly ? 'Read-only' : 'Read-only'}
              </label>
            </div>
            <div className="p-col-12">
              <Checkbox
                inputId="required"
                checked={required}
                onChange={(e) => setRequired(e.checked)}
              />
              <label
                htmlFor="required"
                style={{ paddingLeft: '10px' }}
              >{required ? 'Required' : 'Required'}
              </label>
            </div>
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  };

  return (
    <Dialog
      header={header}
      visible={visible}
      maximizable
      modal
      closable={false}
      style={{ width: '50vw' }}
      footer={renderFooter()}
      onHide={() => setVisible(false)}
    >
      <Fieldset legend="Basic Properties" toggleable>
        <div className="p-col-12">
          <div className="p-grid p-fluid">
            {renderLabel()}
            {renderHint()}
            {renderName()}
            {renderDefault()}
            {renderRange()}
            {renderCalendar()}
            {renderReadOnly()}
            {renderStyle()}
            {renderMultiple()}
            {renderDatatable()}
            {renderRepeating()}
            {renderType()}

          </div>
        </div>
      </Fieldset>
      {renderAnnotation()}
      {renderMatchingQueries()}
      {renderAdvanced()}

    </Dialog>
  );
};

export default Question;
