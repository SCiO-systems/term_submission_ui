import axios from 'axios';

export default class NodeService {
  // eslint-disable-next-line class-methods-use-this
  getTreeTableNodes() {
    return axios.get('assets/demo/data/treetablenodes.json').then((res) => res.data.root);
  }

  // eslint-disable-next-line class-methods-use-this
  getTreeNodes() {
    return axios.get('assets/demo/data/treenodes.json').then((res) => res.data.root);
  }

  // eslint-disable-next-line class-methods-use-this
  getSemanticSuggestions(ontology, term) {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/suggestions/${ontology}/${term}`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  getUnitSuggestions(term) {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/units/${term}`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  getExtractedKeywords(question) {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/extraction/${question}`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  postQuestionnaire(questionnaire) {
    return axios.post(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/save`, questionnaire)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  updateQuestionnaire(questionnaire) {
    return axios.post(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/update`, questionnaire)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  deleteQuestionnaire(uuid) {
    return axios.delete(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/questionnaire/${uuid}`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  getQuestions(question) {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/search/${question}`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  getLanguage() {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/languages`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  getVocabularies() {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/ontologies`)
      .then(
        (data) => data.data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  getQuestionnaires() {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/questionnaires`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  getQuestionnaire(uuid) {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/questionnaire/${uuid}`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  getQuestionnaireXLSForm(uuid) {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/agrofimsplus/download/${uuid}`)
      .then(
        (data) => data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }
}
