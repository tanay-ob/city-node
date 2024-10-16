// Add imports
const http = require("http");
const fs = require("fs");
const helper = require("./helper");

// read cities json from file
const data = fs.readFileSync("./cities.json", "utf-8");
const cities = JSON.parse(data);

// functions
const getCitySummary = (city) => ({
  name: city.name,
  state: city.state,
  population: city.population,
  summerTemp: city.averageTemperature.summer,
  winterTemp: city.averageTemperature.winter,
  image: city.mainImage,
});

const findCity = (url) => {
  const cityToSearch = helper.getParamValue(url);
  const filterdCities = cities.filter(
    (city) => city.name.toLowerCase() === cityToSearch.toLowerCase()
  );
  const city = filterdCities[0];
  return city;
};

const getSortedCity = (url) => {
  const fieldToSort = helper.getParamValue(url);
  const sortedCities = cities.sort((a, b) => {
    return a[fieldToSort].localeCompare(b[fieldToSort]);
  });
  return sortedCities.map(getCitySummary);
};

const getCitiesWithTempUnit = (cities, tempUnit) => {
  if (tempUnit === "F" || tempUnit === "f") {
    return cities.map((city) => {
      const summerTemp = helper.convertToFahrenheit(
        city.averageTemperature.summer
      );
      const winterTemp = helper.convertToFahrenheit(
        city.averageTemperature.winter
      );
      return {
        ...getCitySummary(city),
        summerTemp,
        winterTemp,
      };
    });
  } else {
    return cities.map(getCitySummary);
  }
};

const setResponseHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.writeHead(200, { "Content-Type": "application/json" });
};

// creating server
const server = http.createServer((req, res) => {
  setResponseHeaders(res);
  let response = { message: "Hello World" };
  // get cities
  if (req.url === "/cities") {
    response = cities.map(getCitySummary);
  }

  // search cities ex: "/cities?city=Mumbai"
  else if (req.url.includes("?city=")) {
    response = findCity(req.url);
  }

  // sort cities by field ex: "/cities?sortBy=state"
  else if (req.url.includes("?sortBy=")) {
    response = getSortedCity(req.url);
  }

  // get cities with tempUnit °F or °C ex: "/cities?tempUnit=F"
  else if (req.url.includes("?tempUnit=")) {
    const tempUnit = helper.getParamValue(req.url);
    response = getCitiesWithTempUnit(cities, tempUnit);
  }

  res.end(JSON.stringify(response));
});

// listening to server port
const PORT = 8001;
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
