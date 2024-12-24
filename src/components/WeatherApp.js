import React, { useState } from "react";
import {
  CiCloudMoon,
  CiCloudSun,
  CiSearch,
  CiCloudRainbow,
  CiDroplet,
} from "react-icons/ci";

import { FaWind } from "react-icons/fa";

const WeatherApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Replace with your actual API key
  const API_KEY = "2ad766796d4c647e55d94f8ee0331775";

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Fetch current weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();

      if (weatherData.cod !== 200) {
        throw new Error(weatherData.message);
      }

      // Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      // Process forecast data to get one reading per day
      const dailyForecast = forecastData.list
        .filter((reading) => reading.dt_txt.includes("12:00:00"))
        .slice(0, 5);

      setWeather(weatherData);
      setForecast(dailyForecast);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Weather App</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${
              darkMode
                ? "bg-gray-800 text-yellow-400"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {darkMode ? <CiCloudMoon size={24} /> : <CiCloudSun size={24} />}
          </button>
        </div>

        {/* CiSearch Form */}
        <form onSubmit={fetchWeather} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className={`flex-1 p-3 rounded-lg ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              } border border-gray-300`}
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : <CiSearch size={24} />}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        {/* Current Weather */}
        {weather && (
          <div
            className={`p-6 rounded-lg mb-8 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <h2 className="text-2xl font-bold mb-4">{weather.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <CiCloudRainbow size={48} className="mx-auto mb-2" />
                <p className="text-xl">{Math.round(weather.main.temp)}°C</p>
                <p className="text-gray-500">
                  {weather.weather[0].description}
                </p>
              </div>
              <div className="text-center">
                <FaWind size={48} className="mx-auto mb-2" />
                <p className="text-xl">{weather.wind.speed} m/s</p>
                <p className="text-gray-500">Wind Speed</p>
              </div>
              <div className="text-center">
                <CiDroplet size={48} className="mx-auto mb-2" />
                <p className="text-xl">{weather.main.humidity}%</p>
                <p className="text-gray-500">Humidity</p>
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <div
            className={`p-6 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {forecast.map((day) => (
                <div key={day.dt} className="text-center">
                  <p className="font-bold">
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <CiCloudRainbow size={32} className="mx-auto my-2" />
                  <p>{Math.round(day.main.temp)}°C</p>
                  <p className="text-sm text-gray-500">
                    {day.weather[0].description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;

// e6fd3b0b7ea6c1d1ae8f5a97108468df
// api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid={API key}
