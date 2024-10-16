module.exports = {
  getParamValue: (url) => {
    const indexOfEq = url.indexOf("=");
    return url.slice(indexOfEq + 1);
  },
  convertToFahrenheit: (tempStr) => {
    let temp = tempStr.split("°")[0];
    temp = parseFloat(temp);
    return temp * (9 / 5) + 32 + "°F";
  },
};
