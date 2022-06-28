import axios from 'axios';

export default class VocabularyService {
  getVocabularies = () => axios.get('assets/demo/data/vocabularies.json').then((res) => res.data);
}
