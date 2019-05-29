import * as api from '../../datastore/api_requests';

export const ActionTypes = {
  SET_USER_DATA: 'SET_USER_DATA',
  SET_FREQUENT_LOCATIONS: 'SET_FREQUENT_LOCATIONS',
  SET_MOST_PRODUCTIVE_DAYS: 'SET_MOST_PRODUCTIVE_DAYS',
  SET_LEAST_PRODUCTIVE_DAYS: 'SET_LEAST_PRODUCTIVE_DAYS',
  SET_MOST_PRODUCTIVE_LOCATIONS: 'SET_MOST_PRODUCTIVE_LOCATIONS',
  SET_PRODUCTIVITY_SCORES: 'SET_PRODUCTIVITY_SCORES',
  SET_NEW_LOCATIONS: 'SET_NEW_LOCATIONS',
  SET_PROVIDED_BACKGROUND_LOCATION: 'SET_PROVIDED_BACKGROUND_LOCATION',
  API_ERROR: 'API_ERROR',
  SET_USER_DATA_IN_PROGRESS: 'SET_USER_DATA_IN_PROGRESS',
  SET_FREQUENT_LOCATIONS_IN_PROGRESS: 'SET_FREQUENT_LOCATIONS_IN_PROGRESS',
  SET_MOST_PRODUCTIVE_DAYS_IN_PROGRESS: 'SET_MOST_PRODUCTIVE_DAYS_IN_PROGRESS',
  SET_LEAST_PRODUCTIVE_DAYS_IN_PROGRESS: 'SET_LEAST_PRODUCTIVE_DAYS_IN_PROGRESS',
  SET_MOST_PRODUCTIVE_LOCATIONS_IN_PROGRESS: 'SET_MOST_PRODUCTIVE_LOCATIONS_IN_PROGRESS',
  SET_PRODUCTIVITY_SCORES_IN_PROGRESS: 'SET_PRODUCTIVITY_SCORES_IN_PROGRESS',
  SET_NEW_LOCATIONS_IN_PROGRESS: 'SET_NEW_LOCATIONS_IN_PROGRESS',
};

const setUserData = id => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_USER_DATA_IN_PROGRESS, payload: true });
    api
      .getUserInfo(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_USER_DATA_IN_PROGRESS, payload: false });
        dispatch({ type: ActionTypes.SET_USER_DATA, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setFrequentLocations = (id, numberOfItems) => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_FREQUENT_LOCATIONS_IN_PROGRESS, payload: true });
    api
      .getFrequentLocations(id, numberOfItems)
      .then(response => {
        dispatch({ type: ActionTypes.SET_FREQUENT_LOCATIONS_IN_PROGRESS, payload: false });
        dispatch({ type: ActionTypes.SET_FREQUENT_LOCATIONS, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setMostProductiveDays = id => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_MOST_PRODUCTIVE_DAYS_IN_PROGRESS, payload: true });
    api
      .getMostProductiveDays(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_MOST_PRODUCTIVE_DAYS_IN_PROGRESS, payload: false });
        dispatch({ type: ActionTypes.SET_MOST_PRODUCTIVE_DAYS, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setLeastProductiveDays = id => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_LEAST_PRODUCTIVE_DAYS_IN_PROGRESS, payload: true });
    api
      .getLeastProductiveDays(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_LEAST_PRODUCTIVE_DAYS_IN_PROGRESS, payload: false });
        dispatch({ type: ActionTypes.SET_LEAST_PRODUCTIVE_DAYS, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setMostProductiveLocations = id => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_MOST_PRODUCTIVE_LOCATIONS_IN_PROGRESS, payload: true });
    api
      .getMostProductiveLocations(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_MOST_PRODUCTIVE_LOCATIONS_IN_PROGRESS, payload: false });
        dispatch({ type: ActionTypes.SET_MOST_PRODUCTIVE_LOCATIONS, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setProductivityScores = id => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_PRODUCTIVITY_SCORES_IN_PROGRESS, payload: true });
    api
      .getProductivityScores(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_PRODUCTIVITY_SCORES_IN_PROGRESS, payload: false });
        dispatch({ type: ActionTypes.SET_PRODUCTIVITY_SCORES, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setNewLocations = id => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_NEW_LOCATIONS_IN_PROGRESS, payload: true });
    api
      .getNewLocations(id)
      .then(response => {
        dispatch({ type: ActionTypes.SET_NEW_LOCATIONS_IN_PROGRESS, payload: false });
        dispatch({ type: ActionTypes.SET_NEW_LOCATIONS, payload: response });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.API_ERROR, payload: error });
      });
  };
};

const setProvidedBackgroundLocation = bool => {
  return {
    type: ActionTypes.SET_PROVIDED_BACKGROUND_LOCATION,
    payload: bool,
  };
};

export {
  setUserData,
  setFrequentLocations,
  setMostProductiveDays,
  setLeastProductiveDays,
  setMostProductiveLocations,
  setProductivityScores,
  setNewLocations,
  setProvidedBackgroundLocation,
};
