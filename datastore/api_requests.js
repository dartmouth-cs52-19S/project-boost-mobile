import axios from 'axios';

// const API_URL = 'https://project-boost.herokuapp.com/api';
const API_URL = 'http://localhost:9090/api';

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

const getMostProductiveDays = id => {
  return new Promise((resolve, reject) => {
    const promises = [];
    const timelines = [1000000, 7, 30];

    timelines.forEach(time => {
      promises.push(
        new Promise((resolve, reject) => {
          axios
            .get(`${API_URL}/getMostProductiveWeekDay?userID=${id}&days=${time}`)
            .then(response => {
              resolve(response.data);
            })
            .catch(error => {
              reject(error);
            });
        })
      );
    });

    Promise.all(promises)
      .then(result => {
        const output = {};

        result.forEach(obj => {
          output[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
        });

        resolve(output);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getLeastProductiveDays = id => {
  return new Promise((resolve, reject) => {
    const promises = [];
    const timelines = [1000000, 7, 30];

    timelines.forEach(time => {
      promises.push(
        new Promise((resolve, reject) => {
          axios
            .get(`${API_URL}/getLeastProductiveWeekDay?userID=${id}&days=${time}`)
            .then(response => {
              resolve(response.data);
            })
            .catch(error => {
              reject(error);
            });
        })
      );
    });

    Promise.all(promises)
      .then(result => {
        const output = {};

        result.forEach(obj => {
          output[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
        });

        resolve(output);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getMostProductiveLocations = id => {
  return new Promise((resolve, reject) => {
    const promises = [];
    const timelines = [1000000, 7, 30];

    timelines.forEach(time => {
      promises.push(
        new Promise((resolve, reject) => {
          axios
            .get(
              `${API_URL}/mostProductiveLocationsRankedLastNDays?uid=${id}&numberOfItems=${5}&days=${time}`
            )
            .then(response => {
              resolve(response.data);
            })
            .catch(error => {
              reject(error);
            });
        })
      );
    });

    Promise.all(promises)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getProductivityScores = id => {
  return new Promise((resolve, reject) => {
    const promises = [];
    const timelines = [1000000, 7, 30];

    timelines.forEach(time => {
      promises.push(
        new Promise((resolve, reject) => {
          axios
            .get(`${API_URL}/productivityScoresLastNDays?uid=${id}&days=${time}`)
            .then(response => {
              resolve(response.data);
            })
            .catch(error => {
              reject(error);
            });
        })
      );
    });

    Promise.all(promises)
      .then(result => {
        const output = {};

        result.forEach(obj => {
          output[obj.days] = obj.output;
        });

        resolve(output);
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

export {
  getUserInfo,
  getFrequentLocations,
  updateUserSettings,
  getMostProductiveDays,
  getLeastProductiveDays,
  getMostProductiveLocations,
  getProductivityScores,
};
