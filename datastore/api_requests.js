import axios from 'axios';

const API_URL = 'https://project-boost.herokuapp.com/api';

const getUserInfo = id => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/getAuth`, { userID: id })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export { getUserInfo };
