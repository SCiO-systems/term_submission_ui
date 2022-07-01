import axios from 'axios';

export default class NodeService {
  // eslint-disable-next-line class-methods-use-this
  validateCAPTCHA(response) {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/captcha/${response}`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  postTerm(submittedTerm) {
    const headers = {
      'Content-Type': 'application/json',
    };

    return axios.post(`${process.env.REACT_APP_RELAY_URL}/terms/submit`, submittedTerm,
      {
        headers,
      })
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
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/open/units/${term}`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  getTermSuggestions(term) {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/open/terms/${term}`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }

  // eslint-disable-next-line class-methods-use-this
  getCropSuggestions(term) {
    return axios.get(`${process.env.REACT_APP_RELAY_URL}/open/crops/${term}`)
      .then(
        (data) => data.data)
      .catch(
        (data) => {
          console.error(data);
        }
      );
  }
}
