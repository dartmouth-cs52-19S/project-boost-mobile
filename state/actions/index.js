const setUserID = uid => {
  return {
    type: 'setUserID',
    value: uid,
  };
};

const setUserData = userData => {
  return {
    type: 'setUserData',
    value: userData,
  };
};

const setFrequentLocations = frequentLocations => {
  return {
    type: 'setFrequentLocations',
    value: frequentLocations,
  };
};

const setMostProductiveDays = days => {
  return {
    type: 'setMostProductiveDays',
    value: days,
  };
};

const setLeastProductiveDays = days => {
  return {
    type: 'setLeastProductiveDays',
    value: days,
  };
};

const setMostProductiveLocations = locations => {
  return {
    type: 'setMostProductiveLocations',
    value: locations,
  };
};

const setProductivityScores = scores => {
  return {
    type: 'setProductivityScores',
    value: scores,
  };
};

export {
  setUserID,
  setUserData,
  setFrequentLocations,
  setMostProductiveDays,
  setLeastProductiveDays,
  setMostProductiveLocations,
  setProductivityScores,
};
