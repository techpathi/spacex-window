const axios = require("axios").default;

const APICall = async (url, params) => {
  let data = null;
  await axios
    .get(url)
    .then((response) => {
      data = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
};

export default APICall;
