import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
// import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
// import WeatherIcon from "./components/WeatherIcon.js";
// import { ReactComponent as RainIcon } from "./images/rain.svg";
// import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
// import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
// import { ReactComponent as LoadingIcon } from "./images/loading.svg";
// import dayjs from "dayjs";
import { getMoment, findLocation } from "./utils/helper.js";
import WeatherCard from "./views/WeatherCard.js";
import useWeatherAPI from "./hooks/useWeatherAPI.js";
import WeatherSetting from "./views/WeatherSetting.js";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KEY = "CWB-B2B64A70-4480-4276-AFEE-AEF38A30D33A";

const App = () => {
  const storageCity = localStorage.getItem("cityName") || "臺北市";
  const [currentCity, setCurrentCity] = useState(storageCity);
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };
  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );
  const { cityName, locationName, sunriseCityName } = currentLocation;

  const [currentPage, setCurrentPage] = useState("WeatherCard");
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });
  const [currentTheme, setCurrentTheme] = useState("light");

  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}

        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            handleCurrentPageChange={handleCurrentPageChange}
            handleCurrentCityChange={handleCurrentCityChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
