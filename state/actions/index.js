import * as api from '../../datastore/api_requests';

export const ActionTypes = {
  FETCH_USER_INFO: 'FETCH_USER_INFO',
  SET_USER_ID: 'SET_USER_ID',
  FETCH_TOP_FIVE: 'FETCH_TOP_FIVE',
  FETCH_AVG: 'FETCH_AVG',
};

const fetchUserInfo = id => {
  return dispatch => {
    api
      .getUserInfo(id)
      .then(response => {
        dispatch({ type: ActionTypes.FETCH_USER_INFO, payload: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

const setUserId = uid => {
  return dispatch => dispatch({ type: ActionTypes.FETCH_USER_INFO, payload: uid });
};

const fetchTopFive = id => {
  return (dispatch, reject) => {
    api
      .getTopFive(id)
      .then(response => {
        dispatch({ type: ActionTypes.FETCH_TOP_FIVE, payload: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

const fetchAverageProductivity = id => {
  return dispatch => {
    api
      .getAverageProductivity(id)
      .then(response => {
        dispatch({ type: ActionTypes.FETCH_AVG, payload: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export { fetchUserInfo, setUserId, fetchTopFive, fetchAverageProductivity };
