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

const getFrequentLocations = (id, numberOfItems) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${API_URL}/mostFrequentlyVisitedLocationsRanked?uid=${id}&numberOfItems=${numberOfItems}`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const updateUserSettings = (
  userID,
  homeLocation,
  homeLocationLatLong,
  presetProductiveLocations
) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${API_URL}/updateUserSettings`, {
        userID,
        homeLocation,
        homeLocationLatLong:
          homeLocationLatLong.length > 0
            ? `${homeLocationLatLong[0]} , ${homeLocationLatLong[1]}`
            : '',
        presetProductiveLocations,
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getNewLocations = userID => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${API_URL}/getLocationsWithProductivityNullWithinLastNDays?userID=vSBrHUpwFZPqGIisDcBPS6cuLTx1&days=${31}`
      )
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const updateLocationProductivity = (locationID, userID, productivity) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${API_URL}/updateProductivityLevel/${locationID}`, {
        userID: 'vSBrHUpwFZPqGIisDcBPS6cuLTx1',
        productivity,
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
export {
  getUserInfo,
  getFrequentLocations,
  updateUserSettings,
  getNewLocations,
  updateLocationProductivity,
};
