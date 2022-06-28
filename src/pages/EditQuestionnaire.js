/* eslint-disable prefer-const */
import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import { SpeedDial } from 'primereact/speeddial';
import { Tooltip } from 'primereact/tooltip';
import { ContextMenu } from 'primereact/contextmenu';
import { Messages } from 'primereact/messages';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { BlockUI } from 'primereact/blockui';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { UserContext } from '../store';
import Question from '../components/forms/Question';
import VocabularyService from '../services/VocabularyService';
import NodeService from '../services/NodeService';

const EditQuestionnaire = (props) => {
  const [visibleSave, setVisibleSave] = useState(false);
  const [visibleDownload, setVisibleDownload] = useState(false);
  const [visibleDashboard, setVisibleDashboard] = useState(false);
  const toast = useRef(null);

  const { setUser } = useContext(UserContext);
  const history = useHistory();

  // Block UI
  const [blockedPanel, setBlockedPanel] = useState(false);

  // Settings
  const [ID, setID] = useState('');
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');

  // Questions
  const [questionsConfiguration, setQuestionsConfiguration] = useState(null);
  const [question, setQuestion] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [questionMode, setQuestionMode] = useState(null);

  // Group Selections
  const [nodes, setNodes] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState([]);
  const [selectedLabelTag, setSelectedLabelTag] = useState(true);
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  const [languageValues, setLanguageValues] = useState([]);
  const [languageValue, setLanguageValue] = useState(null);

  const [completeQuestionnaire, setCompleteQuestionnaire] = useState(null);
  const [vocabularies, setVocabularies] = useState(null);

  // XLSForm
  const [model, setModel] = useState({ survey: [], choices: [], settings: {} });
  const [survey, setSurvey] = useState(null);

  const cm = useRef(null);

  // Messages
  const msgsID = useRef(null);
  const msgsTitle = useRef(null);

  const menu = [
    {
      label: 'Delete',
      icon: 'fa-duotone fa-eraser',
      command: () => {
        if (selectedNodeKey === 'root') {
          toast.current.show({ severity: 'warn', summary: 'Not Allowed', detail: 'Delete of Questionnaire element is not permitted' });
        } else {
          const filtered = nodes.filter((f) => f.key === selectedNodeKey);
          if (filtered && filtered.length > 0) {
            // eslint-disable-next-line no-param-reassign
            const check = nodes.filter((f) => f.key !== selectedNodeKey);
            if (check.length === 0) {
              setSelectedGroup(null);
              setNodes(null);
            } else {
              setSelectedGroup(null);
              setNodes([...check]);
            }
          }
          nodes.forEach(
            (item) => {
              deleteNodeFromTree(item, selectedNodeKey);
            }
          );
        }
      },
    },
  ];

  const items = [
    {
      label: 'Text',
      icon: 'fa-duotone fa-input-text',
      command: () => {
        setQuestion(questionsConfiguration.text);
        setQuestionData({});
        setQuestionMode('new');
        setShowQuestion(true);
      },
    },
    {
      label: 'Barcode',
      icon: 'fa-duotone fa-barcode-read',
      command: () => {
        setQuestion(questionsConfiguration.barcode);
        setQuestionData({});
        setQuestionMode('new');
        setShowQuestion(true);
      },
    },
    {
      label: 'Media',
      icon: 'fa-duotone fa-photo-film-music',
      command: () => {
        setQuestion(questionsConfiguration.media);
        setQuestionData({});
        setQuestionMode('new');
        setShowQuestion(true);
      },
    },
    {
      label: 'Selection',
      icon: 'fa-duotone fa-square-check',
      command: () => {
        setQuestion(questionsConfiguration.selection);
        setQuestionData({});
        setQuestionMode('new');
        setShowQuestion(true);
      },
    },
    {
      label: 'Location',
      icon: 'fa-duotone fa-location-dot',
      command: () => {
        setQuestion(questionsConfiguration.location);
        setQuestionData({});
        setQuestionMode('new');
        setShowQuestion(true);
      },
    },
    {
      label: 'Date/Time',
      icon: 'fa-duotone fa-calendar',
      command: () => {
        setQuestion(questionsConfiguration.calendar);
        setQuestionData({});
        setQuestionMode('new');
        setShowQuestion(true);
      },
    },
    {
      label: 'Numeric',
      icon: 'fa-duotone fa-input-numeric',
      command: () => {
        setQuestion(questionsConfiguration.numeric);
        setQuestionData({});
        setQuestionMode('new');
        setShowQuestion(true);
      },
    },
    {
      label: 'Group',
      icon: 'fa-duotone fa-object-group green-group',
      command: () => {
        setQuestion(questionsConfiguration.group);
        setQuestionData({});
        setQuestionMode('new');
        setShowQuestion(true);
      },
    },
  ];

  useEffect(() => {
    setBlockedPanel(true);
    // eslint-disable-next-line react/destructuring-assignment
    const { state } = props.location;

    if (state && state.questionnaire) {
      setID(state.questionnaire.metadata.ID);
      setTitle(state.questionnaire.metadata.title);
      setVersion(state.questionnaire.metadata.version);
      setLanguageValue(state.questionnaire.metadata.language);
      setCompleteQuestionnaire(state.questionnaire);

      let tempNodes = nodes;
      tempNodes.push(state.questionnaire);
      setNodes([...tempNodes]);
    } else {
      history.push('/');
    }

    const vocService = new VocabularyService();
    vocService.getVocabularies().then(
      (data) => {
        setQuestionsConfiguration(data);
      }
    ).catch(
      (data) => {
        console.error(data);
      }
    );

    const ns = new NodeService();
    ns.getLanguage().then(
      (data) => {
        if (data.length) {
          setLanguageValues(data);
        } else {
          setLanguageValues([]);
        }
        setBlockedPanel(false);
      }
    ).catch(
      (data) => console.log(data)
    );

    ns.getVocabularies().then(
      (data) => {
        setVocabularies(data);
      }
    ).catch(
      (data) => console.log(data)
    );

    // nodeService.getTreeNodes().then((data) => setNodes(data));
  }, []); // eslint-disable-line

  const addMessages = (message, id) => {
    if (id === 'ID') {
      msgsID.current.show([
        message,
      ]);
    } else if (id === 'title') {
      msgsTitle.current.show([
        message,
      ]);
    }
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

  const printOutput = (data) => {
    setQuestionData(null);
    setShowQuestion(false);

    let icon = '';
    let group = false;
    let uitype = '';

    if (data) {
      if (data.id === 'media') {
        icon = 'fa-duotone fa-photo-film-music fa-xl';
        uitype = 'Media';
      } else if (data.id === 'barcode') {
        icon = 'fa-duotone fa-barcode-read fa-xl';
        uitype = 'Barcode';
      } else if (data.id === 'calendar') {
        icon = 'fa-duotone fa-calendar fa-xl';
        uitype = 'Calendar';
      } else if (data.id === 'location') {
        icon = 'fa-duotone fa-location-dot fa-xl';
        uitype = 'Location';
      } else if (data.id === 'numeric') {
        icon = 'fa-duotone fa-input-numeric fa-xl';
        uitype = 'Numeric';
      } else if (data.id === 'text') {
        icon = 'fa-duotone fa-input-text fa-xl';
        uitype = 'Text';
      } else if (data.id === 'selection') {
        icon = 'fa-duotone fa-square-check';
        uitype = 'Selection';
      } else if (data.id === 'group') {
        group = true;
        icon = 'fa-duotone fa-object-group fa-xl';
        uitype = 'Group';
      }
      // eslint-disable-next-line no-param-reassign
      data.uitype = uitype;

      if (data.mode === 'update') {
        const leaf = {
          key: data.key,
          label: `${data.label} (${data.name})`,
          icon,
          data,
        };

        if (group) {
          leaf.children = [];
        }

        nodes.forEach(
          (item) => {
            updateNodeTree(item, data.key, data);
          }
        );
      } else if (data.mode === 'new') {
        if (nodes.length === null) {
          // eslint-disable-next-line no-param-reassign
          data.key = '0';

          const leaf = {
            key: '0',
            label: `${data.label} (${data.name})`,
            icon,
            data,
          };

          if (group) {
            leaf.children = [];
          }

          const tempNodes = [];
          tempNodes.push(leaf);
          // updateModel(leaf);
          setNodes([...tempNodes]);
        } else if (selectedGroup) {
          if ((selectedGroup.node.icon === 'fa-duotone fa-object-group fa-xl') ||
            (selectedGroup.node.icon === 'fa-duotone fa-hashtag fa-xl')) {
            const leafNode = selectedGroup.node;
            const parentKey = leafNode.key;
            const children = leafNode.children.length;
            const key = `${parentKey}-${children}`;
            // eslint-disable-next-line no-param-reassign
            data.key = key;

            const leaf = {
              key,
              label: `${data.label} (${data.name})`,
              icon,
              data,
            };

            if (group) {
              leaf.children = [];
            }
            // updateModel(leaf);
            leafNode.children.push(leaf);
          } else {
            const key = nodes.length;
            // eslint-disable-next-line no-param-reassign
            data.key = key;
            const leaf = {
              key,
              label: `${data.label} (${data.name})`,
              icon,
              data,
            };

            if (group) {
              leaf.children = [];
            }

            const tempNodes = nodes;
            tempNodes.push(leaf);
            // updateModel(leaf);
            setNodes([...tempNodes]);
          }
        } else {
          const tempNodes = nodes;
          const filtered = tempNodes.filter((f) => f.key === 'root');

          if (filtered && filtered.length === 1) {
            filtered.forEach(
              (item) => {
                const key = `root-${item.children.length}`;
                // eslint-disable-next-line no-param-reassign
                data.key = key;
                const leaf = {
                  key,
                  label: `${data.label} (${data.name})`,
                  icon,
                  data,
                };

                if (group) {
                  leaf.children = [];
                }
                item.children.push(leaf);
                // updateModel(leaf);
              }
            );
          }
        }
      }
    }
  };

  const onSelection = (value) => {
    console.log(value);
  };

  const deleteNodeFromTree = (node, nodeId) => {
    if (node.children && node.children.length) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < node.children.length; i++) {
        const filtered = node.children.filter((f) => f.key === nodeId);
        if (filtered && filtered.length > 0) {
          // eslint-disable-next-line no-param-reassign
          node.children = node.children.filter((f) => f.key !== nodeId);
          return;
        }
        deleteNodeFromTree(node.children[i], nodeId);
      }
    }
  };

  // eslint-disable-next-line consistent-return
  const updateNodeTree = (node, nodeId, data) => {
    if (node.children && node.children.length) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].key === nodeId) {
          // eslint-disable-next-line no-param-reassign
          node.children[i].data = data;
          // eslint-disable-next-line no-param-reassign
          node.children[i].label = `${data.label} (${data.name}) `;
          return;
        }
        updateNodeTree(node.children[i], nodeId);
      }
    }
  };

  const insertNodeIntoTree = (node, nodeId, newNode, id) => {
    if (node.key === nodeId) {
      if (newNode) {
        node.members.push(newNode);
      }
    } else if (node.survey != null) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < node.survey.length; i++) {
        insertNodeIntoTree(node.survey[i], nodeId, newNode);
      }
    }
  };

  const onNodeSelect = (node) => {
    setSelectedNodeKey(node.key);
    toast.current.show({ severity: 'success', summary: 'Question Selected:', detail: node.node.data.label, life: 3000 });
    setSelectedGroup(node);

    // setSelectedLabel(node.node.data.label);
    let tempSelectedLabel = [];
    tempSelectedLabel.push(node.node.data.label);
    setSelectedLabelTag(false);
    // tempSelectedLabel.push(breadcrumb);
    setSelectedLabel([tempSelectedLabel]);
    // setSelectedLabel(node.node.data.label);
  };

  const onNodeUnselect = (node) => {
    toast.current.show({ severity: 'success', summary: 'Question Unselected:', detail: node.node.data.label, life: 3000 });
    setSelectedGroup(null);
    setSelectedLabel([]);
    setSelectedLabelTag(true);
  };

  const expandAll = () => {
    const tempExpandedKeys = {};
    for (const node of nodes) {
      expandNode(node, tempExpandedKeys);
    }
    setExpandedKeys(tempExpandedKeys);
  };

  const expandNode = (node, tempExpandedKeys) => {
    if (node.children && node.children.length) {
      // eslint-disable-next-line no-param-reassign
      tempExpandedKeys[node.key] = true;

      for (const child of node.children) {
        expandNode(child, tempExpandedKeys);
      }
    }
  };

  const collapseAll = () => {
    setExpandedKeys({});
  };

  const rightContents = (
    <>
      <div className="speeddial-linear-demo" style={{ position: 'relative', height: '50px' }}>
        <Tooltip target=".speeddial-linear-demo .speeddial-left .p-speeddial-action" position="top" />
        <Tooltip target=".p-speeddial-button" position="left">
          Add a Question: choose the type depending on the kind of response you expect
          (e.g., numeric, text, geolocation etc.)
        </Tooltip>
        <SpeedDial model={items} direction="left" className="speeddial-left" />
      </div>
    </>
  );

  const leftContents = (
    <>
      <Tooltip target=".current-selection" position="top" content="Current Selection" />
      Current Selection:
      <span hidden={selectedLabelTag}>
        <Tag value={selectedLabel} severity="success" />
      </span>

    </>
  );

  const leftContentsMain = () => {
    const accept = () => {
      history.push('/');
      toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    };

    const reject = () => {
      toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    };

    return (
      <>
        <ConfirmPopup
          target={document.getElementById('home_button')}
          visible={visibleDashboard}
          onHide={() => setVisibleDashboard(false)}
          message="Are you sure you want to proceed?"
          icon="fa-duotone fa-triangle-exclamation"
          accept={accept}
          reject={reject}
        />
        <Button
          id="home_button"
          onClick={() => setVisibleDashboard(true)}
          icon="fa-duotone fa-list-check"
          label="My Dashboard"
          className="p-button-secondary"
          tooltip="Return to your dashboard"
          tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
        />
      </>
    );
  };

  let localModel = [];
  const traverse = (tree, current = null) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].children) {
        // eslint-disable-next-line no-param-reassign
        tree[i].data.children = [];
        if (current) {
          current.children.push(tree[i].data);
        } else {
          localModel.push(tree[i].data);
        }
        traverse(tree[i].children, tree[i].data);
      } else if (current) {
        current.children.push(tree[i].data);
      } else {
        localModel.push(tree[i].data);
      }
    }
  };

  const accept = () => {
    nodes[0].metadata = {
      title,
      ID,
      version,
      language: languageValue,
    };

    let questionnaire = nodes[0];

    setBlockedPanel(true);
    const ns = new NodeService();
    ns.updateQuestionnaire(questionnaire).then(
      (data) => {
        toast.current.show({ severity: 'info', summary: 'Questionnaire Updated', detail: '', life: 3000 });
      }
    ).catch(
      (data) => {
        console.log(data);
      }).finally(
      () => setBlockedPanel(false)
    );
  };

  const acceptDownload = () => {
    const ns = new NodeService();
    setBlockedPanel(true);
    ns.getQuestionnaireXLSForm(nodes[0].uuid).then(
      (data) => {
        // Message
        let element = document.createElement('a');
        element.setAttribute('href',
          data.data.download_link);
        element.setAttribute('download', `${nodes[0].uuid}.xlsx`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.current.show({ severity: 'info', summary: 'XLSForm Created', detail: '', life: 3000 });
      }
    ).catch(
      (data) => {
        // Message
        console.log(data);
      }).finally(
      () => setBlockedPanel(false)
    );
  };

  const reject = () => {
    toast.current.show({ severity: 'info', summary: 'Rejected', detail: '', life: 3000 });
  };

  const rightContentsMain = (
    <>
      <ConfirmPopup
        target={document.getElementById('save_button')}
        visible={visibleSave}
        onHide={() => setVisibleSave(false)}
        message="Are you sure you want to proceed?"
        icon="fa-duotone fa-triangle-exclamation"
        accept={accept}
        reject={reject}
      />

      <ConfirmPopup
        target={document.getElementById('download_button')}
        visible={visibleDownload}
        onHide={() => setVisibleDownload(false)}
        message="Are you sure you want to proceed?"
        icon="fa-duotone fa-triangle-exclamation"
        accept={acceptDownload}
        reject={reject}
      />
      <Button
        id="download_button"
        onClick={() => acceptDownload()}
        icon="fa-duotone fa-download"
        label="Download"
        className="p-button-secondary p-mr-2"
        tooltip="Download Questionnaire in XLSForm"
        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
      />

      <Button
        id="save_button"
        onClick={() => accept()}
        icon="fad fa-floppy-disk"
        label="Update"
        className="p-button-success"
        tooltip="Update Your Questionnaire"
        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
      />
    </>
  );

  const deleteNode = (node) => {
    const selectedNode = node.key;
    if (selectedNode === 'root') {
      toast.current.show({ severity: 'warn', summary: 'Not Allowed', detail: 'Delete of Questionnaire element is not permitted' });
    } else {
      const filtered = nodes.filter((f) => f.key === selectedNode);
      if (filtered && filtered.length > 0) {
        // eslint-disable-next-line no-param-reassign
        const check = nodes.filter((f) => f.key !== selectedNode);
        if (check.length === 0) {
          setSelectedGroup(null);
          setNodes(null);
        } else {
          setSelectedGroup(null);
          setNodes([...check]);
        }
      }
      nodes.forEach(
        (item) => {
          deleteNodeFromTree(item, selectedNode);
        }
      );
    }

    setNodes([...nodes]);

    return (<></>);
  };

  const editNode = (node) => {
    if (node.data.id === 'numeric') {
      setQuestion(questionsConfiguration.numeric);
    } else if (node.data.id === 'calendar') {
      setQuestion(questionsConfiguration.calendar);
    } else if (node.data.id === 'text') {
      setQuestion(questionsConfiguration.text);
    } else if (node.data.id === 'media') {
      setQuestion(questionsConfiguration.media);
    } else if (node.data.id === 'location') {
      setQuestion(questionsConfiguration.location);
    } else if (node.data.id === 'selection') {
      setQuestion(questionsConfiguration.selection);
    } else if (node.data.id === 'group') {
      setQuestion(questionsConfiguration.group);
    } else if (node.data.id === 'barcode') {
      setQuestion(questionsConfiguration.barcode);
    }

    setQuestionData({ ...node.data });
    setQuestionMode('update');
    setShowQuestion(true);
  };

  const actionTemplate = (node, column) => {
    if (node.key === 'root') {
      return (<></>);
    }
    return (
      <div>
        <Button
          type="button"
          icon="fa-duotone fa-pen-to-square"
          className="p-button-success"
          style={{ marginRight: '.5em' }}
          onClick={() => { editNode(node); }}
        />
        <Button
          type="button"
          icon="fa-duotone fa-trash"
          className="p-button-danger"
          onClick={() => { deleteNode(node); }}
        />
      </div>
    );
  };

  const renderLabelColumn = (node, column) => (<><i className={node.icon} /><span style={{ paddingLeft: '5px' }}>{node.label}</span></>);

  const renderTree = () => {
    if (nodes) {
      return (
        <div className="p-col-12 p-justify-end">
          <Toolbar left={leftContents} right={rightContents} />
          <div className="p-mt-2">
            <TreeTable
              value={nodes}
              filter
              filterMode="lenient"
              selectionMode="checkbox"
              expandedKeys={expandedKeys}
              paginator
              rows={10}
              onSelectionChange={(e) => setSelectedNodeKey(e.value)}
              onSelect={onNodeSelect}
              onUnselect={onNodeUnselect}
              contextMenuSelectionKey={selectedNodeKey}
              onContextMenuSelectionChange={(e) => setSelectedNodeKey(e.value)}
              onContextMenu={(e) => cm.current.show(e.originalEvent)}
              onDragDrop={(e) => setNodes(e.value)}
              dragdropScope="demo"
              onToggle={(e) => setExpandedKeys(e.value)}
              selectionKeys={selectedNodeKey}

            >
              <Column field="label" header="Label" expander body={renderLabelColumn} />
              <Column field="uitype" header="Type" />
              <Column body={actionTemplate} style={{ textAlign: 'center', width: '10rem' }} />
            </TreeTable>

          </div>
        </div>
      );
    }
    return (
      <>
        <h5>You can add a question by pressing the add button</h5>
      </>
    );
  };

  const updateState = (input) => {
    if (input.id === 'title') {
      setTitle(input.value);
      if (input.value.length === 0) {
        addMessages({ severity: 'error', summary: '', detail: 'Title is mandatory', sticky: true }, 'title');
      }
    } else if (input.id === 'version') {
      setVersion(input.value);
    }
  };

  const updateModel = (leaf) => {
    const { data } = leaf;
    const tempModel = model;

    if (!tempModel.settings.style) {
      tempModel.settings.style = 'pages';
    }

    if (data.id === 'ID') {
      tempModel.settings.form_id = data.value;
    } else if (data.id === 'title') {
      tempModel.settings.form_title = data.value;
    } else if (data.id === 'version') {
      tempModel.settings.version = data.value;
    } else if (data.id === 'media') {
      const surveyItem = {
        key: leaf.key,
        type: data.type.name || '',
        label: data.label || '',
        name: data.name || '',
        hint: data.hint || '',
        default: data.default || '',
        required: data.required || 'No',
        read_only: data.read_only || 'No',
        constraint: data.constraint || '',
        constraint_message: data.constraint_message || '',
        condition: data.condition || '',
        calculation: data.calculation || '',
      };

      if (selectedGroup) {
        if (selectedGroup.node.icon === 'fa-duotone fa-object-group fa-xl') {
          insertNodeIntoTree(tempModel.survey[0], selectedGroup.node.key, surveyItem, leaf.key);
        }
      } else {
        tempModel.survey.push(surveyItem);
      }
    } else if (data.id === 'barcode') {
      const surveyItem = {
        key: leaf.key,
        label: data.label || '',
        name: data.name || '',
        hint: data.hint || '',
        default: data.default || '',
        required: data.required || 'No',
        read_only: data.read_only || 'No',
      };
      tempModel.survey.push(surveyItem);
    } else if (data.id === 'calendar') {
      const surveyItem = {
        key: leaf.key,
        type: 'calendar' || '',
        label: data.label || '',
        name: data.name || '',
        hint: data.hint || '',
        default: data.default || '',
        required: data.required || 'No',
        read_only: data.read_only || 'No',
        constraint: data.constraint || '',
        constraint_message: data.constraint_message || '',
        condition: data.condition || '',
        calculation: data.calculation || '',
      };
      tempModel.survey.push(surveyItem);
    } else if (data.id === 'location') {
      const surveyItem = {
        key: leaf.key,
        type: data.type.name || '',
        style: data.style.name || '',
        label: data.label || '',
        name: data.name || '',
        hint: data.hint || '',
        default: data.default || '',
        required: data.required || 'No',
        read_only: data.read_only || 'No',
        constraint: data.constraint || '',
        constraint_message: data.constraint_message || '',
        condition: data.condition || '',
        calculation: data.calculation || '',
      };
      tempModel.survey.push(surveyItem);
    } else if (data.id === 'numeric') {
      const surveyItem = {
        key: leaf.key,
        type: data.type.name || '',
        style: data.style.name || '',
        label: data.label || '',
        name: data.name || '',
        hint: data.hint || '',
        default: data.default || '',
        required: data.required || 'No',
        read_only: data.read_only || 'No',
        constraint: data.constraint || '',
        constraint_message: data.constraint_message || '',
        condition: data.condition || '',
        calculation: data.calculation || '',
      };
      tempModel.survey.push(surveyItem);
    } else if (data.id === 'text') {
      const surveyItem = {
        key: leaf.key,
        style: data.style.name || '',
        label: data.label || '',
        name: data.name || '',
        hint: data.hint || '',
        default: data.default || '',
        required: data.required || 'No',
        read_only: data.read_only || 'No',
        constraint: data.constraint || '',
        constraint_message: data.constraint_message || '',
        condition: data.condition || '',
        calculation: data.calculation || '',
      };
      tempModel.survey.push(surveyItem);
    } else if (data.id === 'group') {
      const surveyItem = {
        key: leaf.key,
        label: data.label || '',
        name: data.name || '',
        required: data.required || 'No',
        read_only: data.read_only || 'No',
        repeating: data.repeating || 'No',
        repeat_count: data.repeat_count || '',
        condition: data.condition || '',
        members: [],
      };
      tempModel.survey.push(surveyItem);
    }

    setModel({ ...tempModel });
  };

  return (
    <div className="input-demo">
      <Toast ref={toast} />
      <ContextMenu model={menu} ref={cm} onHide={() => setSelectedNodeKey(null)} />
      <Toolbar left={leftContentsMain} right={rightContentsMain} className="p-mb-4" />
      <BlockUI blocked={blockedPanel}>
        <Panel header="Questionnaire Settings" toggleable headerTemplate={template} className="p-mb-4">
          <div className="p-col-12">
            <div className="p-grid p-fluid">
              <div className="p-col-12 p-md-12">
                <div className="p-inputgroup">
                  <Button label="Questionnaire Title" />
                  <InputText value={title} id="title" placeholder="" onChange={(e) => updateState(e.target)} />
                </div>
                <Messages ref={msgsTitle} />
              </div>
              <div className="p-col-12 p-md-6">
                <div className="p-inputgroup">
                  <Button label="Language" />
                  <Dropdown
                    optionLabel="name"
                    filter
                    showClear
                    filterBy="name"
                    value={languageValue}
                    onChange={(e) => setLanguageValue(e.value)}
                    options={languageValues}
                    placeholder="Select a language"
                    className="multiselect-custom"
                  />
                </div>
              </div>

              <div className="p-col-12 p-md-6">
                <div className="p-inputgroup">
                  <Button label="Version" />
                  <InputNumber
                    showButtons
                    buttonLayout="horizontal"
                    decrementButtonClassName="p-button-secondary"
                    incrementButtonClassName="p-button-secondary"
                    incrementButtonIcon="fa-duotone fa-plus"
                    decrementButtonIcon="fa-duotone fa-minus"
                    autocomplete="off"
                    useGrouping={false}
                    value={version}
                    min={1}
                    mode="decimal"
                    id="version"
                    placeholder=""
                    onValueChange={(e) => updateState(e.target)}
                  />
                </div>
              </div>

            </div>
          </div>
        </Panel>
      </BlockUI>
      <BlockUI blocked={blockedPanel}>
        <Panel header="Questions" toggleable headerTemplate={template}>
          {renderTree()}
        </Panel>
      </BlockUI>
      <div>
        <Question
          configuration={question}
          show={showQuestion}
          output={printOutput}
          data={questionData}
          mode={questionMode}
          vocabularies={vocabularies}
        />
      </div>
    </div>
  );
};

export default EditQuestionnaire;
