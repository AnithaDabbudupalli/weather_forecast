import React, { useState } from "react";
import bgImage from "./assets/weather.png";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const getWeatherByCity = async (cityName) => {
    if (cityName.trim() === "") {
      alert("Please enter a city name.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeatherData(data);
        setCity(data.name);
        setError("");
        setSearchTerm("");
      } else {
        setError("City not found!");
        setWeatherData(null);
      }
    } catch (err) {
      console.error("Error fetching city weather:", err);
      setError("Failed to fetch weather data.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeatherData(data);
        setCity(data.name);
        setError("");
      } else {
        setError("Failed to fetch location weather.");
        setWeatherData(null);
      }
    } catch (err) {
      console.error("Geolocation error:", err);
      setError("Failed to fetch location weather.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        () => {
          alert("Permission denied or unable to fetch location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSearchClick = () => {
    getWeatherByCity(searchTerm);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🌤️ Weather Forecast</h1>
      <h2 style={styles.city}>{city}</h2>

      <div style={styles.searchSection}>
        <input
          type="text"
          value={searchTerm}
          placeholder="Enter city..."
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
          style={styles.input}
          aria-label="City name input"
        />
        <button
          onClick={handleSearchClick}
          style={styles.button}
          disabled={loading}
          aria-label="Search city weather"
        >
          Search
        </button>
        <button
          onClick={handleLocationClick}
          style={styles.button}
          disabled={loading}
          aria-label="Use current location"
        >
          📍 Use My Location
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : weatherData ? (
        <div style={styles.weatherBox}>
          <p>🌡️ Temp: {weatherData.main.temp} °C</p>
          <p>💨 Wind: {weatherData.wind.speed} m/s</p>
          <p>🌥️ Condition: {weatherData.weather[0].description}</p>
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial",
    textAlign: "center",
    marginTop: "40px",
    backgroundImage: `url(${bgImage})`, // imported image
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    color: "#fff",
    padding: "20px",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "10px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
  },
  city: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "20px",
    textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
  },
  searchSection: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "200px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
    outline: "none",
  },
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
  weatherBox: {
    marginTop: "20px",
    fontSize: "18px",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "20px",
    borderRadius: "8px",
    display: "inline-block",
  },
  error: {
    color: "#ff6666",
    fontWeight: "bold",
  },
  loading: {
    fontSize: "18px",
    fontStyle: "italic",
  },
};

export default WeatherApp;

