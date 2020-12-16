const axios = require('axios');

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const setAuthorizationToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = token;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const truncateString = (string, nb) => {
  if (string.length > nb) {
    return `${string.substr(0, nb)} ...`;
  }
  return string;
};

const getAverageByArray = (array) => {
  let nb = 0;
  const arrayLength = array.length;
  for (let i = 0; i < arrayLength; i++) {
    nb += Number(array[i]);
  }
  return Number(nb / arrayLength);
};

module.exports = {
  generateRandomString,
  setAuthorizationToken,
  millisToMinutesAndSeconds,
  truncateString,
  getAverageByArray,
};
