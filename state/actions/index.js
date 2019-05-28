import * as api from '../../datastore/api_requests';

export const ActionTypes = {
  SET_USER_DATA: 'SET_USER_DATA',
  SET_FREQUENT_LOCATIONS: 'SET_FREQUENT_LOCATIONS',
  SET_MOST_PRODUCTIVE_DAYS: 'SET_MOST_PRODUCTIVE_DAYS',
  SET_LEAST_PRODUCTIVE_DAYS: 'SET_LEAST_PRODUCTIVE_DAYS',
  SET_MOST_PRODUCTIVE_LOCATIONS: 'SET_MOST_PRODUCTIVE_LOCATIONS',
  SET_PRODUCTIVITY_SCORES: 'SET_PRODUCTIVITY_SCORES',
  API_ERROR: 'API_ERROR',
};

const setUserData = id => {
  return dispatch => {
    api
      .getUserInfo(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_USER_DATA, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setFrequentLocations = (id, numberOfItems) => {
  return dispatch => {
    api
      .getFrequentLocations(id, numberOfItems)
      .then(response => {
        dispatch({ type: ActionTypes.SET_FREQUENT_LOCATIONS, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setMostProductiveDays = id => {
  return dispatch => {
    api
      .getMostProductiveDays(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_MOST_PRODUCTIVE_DAYS, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setLeastProductiveDays = id => {
  return dispatch => {
    api
      .getLeastProductiveDays(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_LEAST_PRODUCTIVE_DAYS, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setMostProductiveLocations = id => {
  return dispatch => {
    api
      .getMostProductiveLocations(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_MOST_PRODUCTIVE_LOCATIONS, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setProductivityScores = id => {
  return dispatch => {
    api
      .getProductivityScores(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_PRODUCTIVITY_SCORES, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

export {
  setUserData,
  setFrequentLocations,
  setMostProductiveDays,
  setLeastProductiveDays,
  setMostProductiveLocations,
  setProductivityScores,
};
