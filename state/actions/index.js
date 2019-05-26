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

export { setUserID, setUserData, setFrequentLocations };
