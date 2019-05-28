import axios from 'axios';
const API_URL = 'https://project-boost.herokuapp.com/api';

const getUserInfo = id => {
  return (resolve, reject) => {
    axios
      .post(`${API_URL}/getAuth`, { userID: id })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  };
};

const getTopFive = id => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/${id}&numberOfItems=5`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getAverageProductivity = id => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL}/productivityScoresLastThirtyDays?uid=${id}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export { getUserInfo, getTopFive, getAverageProductivity };
