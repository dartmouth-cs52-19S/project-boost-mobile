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

const setNewLocations = newLocations => {
  return {
    type: 'setNewLocations',
    value: newLocations,
  };
};

export { setUserID, setUserData, setFrequentLocations, setNewLocations };
