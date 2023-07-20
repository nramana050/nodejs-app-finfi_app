// plugins/globalFunctions.js

export default (context, inject) => {
  inject('getWFMUrlBase', () => {
    return 'http://localhost:8003';
  });
};

