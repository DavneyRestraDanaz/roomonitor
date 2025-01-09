"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Icons = {
  Thermometer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
      <line x1="12" y1="12" x2="12.01" y2="12" />
    </svg>
  ),
  Humidity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
      <path d="M8 13a4 4 0 0 0 8 0" />
    </svg>
  ),
  Motion: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
      <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
      <path d="M18 8a6 6 0 0 0-9.33-5" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Water: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3498DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  Door: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFB84D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
      <path d="M3 21h18" />
      <path d="M3 7h18" />
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M16 12h.01" />
    </svg>
  ),
  DoorLocked: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Lamp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFB84D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  ),
  Sun: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
};

const SensorDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [dataRange, setDataRange] = useState("current");
  const [darkMode, setDarkMode] = useState(false);

  // Function to calculate average
  const calculateAverage = (key) => {
    if (data.length === 0) return "N/A";
    const sum = data.reduce((acc, item) => acc + item[key], 0);
    return (sum / data.length).toFixed(2);
  };

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("https://api-x-six.vercel.app/api/sensors");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const sensorData = await response.json();
        const processedData = sensorData.map((item) => {
          const date = new Date(item.created_at);
          const formattedDate = date.toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).replace(',', '');
        
          return {
            timestamp: formattedDate,
            temperature: item.temperature,
            humidity: item.humidity,
            waterSensor: item.water_sensor,
            motionSensor: item.motion_sensor,
            doorLocked: item.door_locked,
            door: item.door,
            lamp: item.lamp,
          };
        });

        // Check if the new data is different from the current data
        if (JSON.stringify(processedData) !== JSON.stringify(data)) {
          setData(processedData);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };      

    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 3000);
    return () => clearInterval(intervalId);
  }, [data]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderSensorCard = (Icon, title, value, status, detailContent) => {
    const getStatusColor = () => {
      switch(title) {
        case "Temperature":
          return status ? "border-red-500" : "border-gray-200";
        case "Humidity":
          return status ? "border-teal-500" : "border-gray-200";
        case "Motion Sensor":
          return status ? "border-purple-500" : "border-gray-200";
        case "Water Sensor":
          return status ? "border-blue-500" : "border-gray-200";
        case "Door":
          return status ? "border-orange-500" : "border-gray-200";
        case "Door Locked":
          return status ? "border-red-500" : "border-gray-200";
        case "Lamp":
          return status ? "border-yellow-500" : "border-gray-200";
        default:
          return "border-gray-200";
      }
    };

    const getAnimationClass = () => {
      if (title === "Temperature" || title === "Humidity") {
        return "";
      }
      return status ? "animate-pulse" : "";
    };

    return (
      <div
        onClick={() => setSelectedSensor({ title, detailContent })}
        className={`group ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 p-6 relative overflow-hidden border-2 ${getStatusColor()} ${getAnimationClass()} cursor-pointer flex flex-col items-center justify-center text-center ${darkMode ? 'hover:bg-gradient-to-br from-gray-800 to-gray-900' : 'hover:bg-gradient-to-br from-white to-blue-50'}`}
      >
        <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity scale-150 z-0">
          <Icon />
        </div>
        <div className="flex justify-between items-center z-10 relative mb-4">
          <div
            className={`p-4 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors flex items-center justify-center ${getAnimationClass()}`}
          >
            <Icon />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} group-hover:text-blue-600 transition-colors`}>{title}</h3>
          <p className={`text-2xl font-extrabold ${status ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600' : 'text-gray-500'}`}>{value}</p>
        </div>
      </div>
    );
  };

  const SensorModal = ({ sensor, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
      <div className={`${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{sensor.title} Details</h2>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'} text-2xl transition-colors duration-300`}
          >
            ×
          </button>
        </div>
        <div className="space-y-4">{sensor.detailContent}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className={`text-center ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-lg p-8 rounded-3xl shadow-2xl`}>
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 border-r-4 border-b-4 border-transparent mb-4"></div>
          <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} text-xl font-semibold`}>Loading Sensor Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gradient-to-br from-red-900 to-gray-900' : 'bg-gradient-to-br from-red-50 to-pink-50'}`}>
        <div className={`${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center max-w-md mx-auto transform hover:scale-105 transition-transform duration-300`}>
          <div className="text-red-500 text-6xl mb-4 animate-bounce">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Data Fetch Error</h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{error}</p>
        </div>
      </div>
    );
  }

  const latestData = data.length > 0 ? data[0] : null;

  const filterDataByRange = () => {
    const now = new Date();
    if (dataRange === "7hours") {
      return data.filter(item => {
        const itemDate = new Date(item.timestamp);
        return (now - itemDate) <= 7 * 60 * 60 * 1000;
      });
    } else if (dataRange === "1week") {
      return data.filter(item => {
        const itemDate = new Date(item.timestamp);
        return (now - itemDate) <= 7 * 24 * 60 * 60 * 1000;
      });
    } else if (dataRange === "current") {
      return data;
    } else {
      return [];
    }
  };

  const filteredData = filterDataByRange();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} p-4 md:p-8`}>
      {selectedSensor && (
        <SensorModal
          sensor={selectedSensor}
          onClose={() => setSelectedSensor(null)}
        />
      )}
      <div className="container mx-auto max-w-7xl">
        <header className={`flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 space-y-4 md:space-y-0 ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-lg p-6 rounded-3xl shadow-lg`}>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Room Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <div className="text-center md:text-right">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Last Updated</p>
              <p className="font-bold text-lg text-blue-600">
                {latestData?.timestamp || "N/A"}
              </p>
            </div>
          </div>
        </header>
  
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6 mb-8 md:mb-12">
          {renderSensorCard(
            Icons.Thermometer,
            "Temperature",
            `${latestData?.temperature || "N/A"}°C`,
            true,
            <div className="space-y-4">
              <p className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Current Temperature Reading</p>
              <p className="text-3xl font-bold text-red-500">{latestData?.temperature || "N/A"}°C</p>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Normal Range: 20°C - 25°C</p>
              </div>
            </div>
          )}
          {renderSensorCard(
            Icons.Humidity,
            "Humidity",
            `${latestData?.humidity || "N/A"}%`,
            true,
            <div className="space-y-4">
              <p className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Current Humidity Level</p>
              <p className="text-3xl font-bold text-teal-500">{latestData?.humidity || "N/A"}%</p>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Optimal Range: 30% - 60%</p>
              </div>
            </div>
          )}
          {renderSensorCard(
            Icons.Motion,
            "Motion Sensor",
            latestData?.motionSensor ? "Motion" : "No Motion",
            !!latestData?.motionSensor,
            <div className="space-y-4">
              <p className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Motion Detection Status</p>
              <p className="text-3xl font-bold text-purple-500">{latestData?.motionSensor ? "Motion Detected" : "No Motion"}</p>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last movement detected at: {latestData?.timestamp}</p>
              </div>
            </div>
          )}
          {renderSensorCard(
            Icons.Water,
            "Water Sensor",
            latestData?.waterSensor ? "Detected" : "None",
            !!latestData?.waterSensor,
            <div className="space-y-4">
              <p className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Water Detection Status</p>
              <p className="text-3xl font-bold text-blue-500">{latestData?.waterSensor ? "Water Detected" : "No Water"}</p>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sensor Location: Floor Level</p>
              </div>
            </div>
          )}
          {renderSensorCard(
            Icons.Door,
            "Door",
            latestData?.door ? "Open" : "Closed",
            !!latestData?.door,
            <div className="space-y-4">
              <p className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Door Status</p>
              <p className="text-3xl font-bold text-orange-500">{latestData?.door ? "Door Open" : "Door Closed"}</p>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last status change: {latestData?.timestamp}</p>
              </div>
            </div>
          )}
          {renderSensorCard(
            Icons.DoorLocked,
            "Door Locked",
            latestData?.doorLocked ? "Locked" : "Unlocked",
            !!latestData?.doorLocked,
            <div className="space-y-4">
              <p className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Door Lock Status</p>
              <p className="text-3xl font-bold text-red-500">{latestData?.doorLocked ? "Door Locked" : "Door Unlocked"}</p>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Security Status: {latestData?.doorLocked ? "Secured" : "Unsecured"}</p>
              </div>
            </div>
          )}
          {renderSensorCard(
            Icons.Lamp,
            "Lamp",
            latestData?.lamp ? "On" : "Off",
            !!latestData?.lamp,
            <div className="space-y-4">
              <p className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Lamp Status</p>
              <p className="text-3xl font-bold text-yellow-500">{latestData?.lamp ? "Lamp On" : "Lamp Off"}</p>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Power consumption: {latestData?.lamp ? "Active" : "Inactive"}</p>
              </div>
            </div>
          )}
        </div>
  
        <div className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 mb-8 transform hover:scale-[1.02] transition-transform duration-500`}>
          <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
            Sensor Analytics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer relative overflow-hidden`}>
              <div className={`absolute inset-0 ${darkMode ? 'bg-blue-600/10' : 'bg-blue-50/50'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} relative z-10`}>Rata-rata Temperatur</h3>
              <p className="text-2xl font-extrabold text-red-500 relative z-10 group-hover:animate-pulse">{calculateAverage('temperature')}°C</p>
              <div className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10`}>
                Berdasarkan {data.length} pengukuran terakhir
              </div>
            </div>
            <div className={`p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group cursor-pointer relative overflow-hidden`}>
              <div className={`absolute inset-0 ${darkMode ? 'bg-teal-600/10' : 'bg-teal-50/50'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} relative z-10`}>Rata-rata Kelembaban</h3>
              <p className="text-2xl font-extrabold text-teal-500 relative z-10 group-hover:animate-pulse">{calculateAverage('humidity')}%</p>
              <div className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10`}>
                Berdasarkan {data.length} pengukuran terakhir
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative inline-block">
              <button
                onClick={() => setDataRange("current")}
                className={`px-4 py-2 rounded-xl font-medium ${dataRange === "current" ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 hover:bg-blue-100'} transition-all duration-300`}
              >
                Sekarang
              </button>
              <button
                onClick={() => setDataRange("7hours")}
                className={`ml-4 px-4 py-2 rounded-xl font-medium ${dataRange === "7hours" ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 hover:bg-blue-100'} transition-all duration-300`}
              >
                7 Jam Terakhir
              </button>
              <button
                onClick={() => setDataRange("1week")}
                className={`ml-4 px-4 py-2 rounded-xl font-medium ${dataRange === "1week" ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 hover:bg-blue-100'} transition-all duration-300`}
              >
                1 Minggu Terakhir
              </button>
            </div>
          </div>

          {filteredData.length > 0 && (
            <ResponsiveContainer width="100%" height={400} className="mt-4">
              <LineChart data={[...filteredData].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} strokeOpacity={0.7} />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
                  className="text-sm font-medium"
                  tickFormatter={(value) => value.split(' ')[1]}
                />
                <YAxis
                  tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
                  className="text-sm font-medium"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    padding: "12px",
                    color: darkMode ? "#E5E7EB" : "#111827"
                  }}
                  labelStyle={{ color: darkMode ? "#E5E7EB" : "#111827", fontWeight: "600" }}
                  cursor={{ stroke: darkMode ? "#4B5563" : "#D1D5DB", strokeWidth: 1 }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontWeight: "500",
                    color: darkMode ? "#E5E7EB" : "inherit"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#FF4D4D"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 8, fill: "#FF4D4D" }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#4ECDC4"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 8, fill: "#4ECDC4" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default SensorDashboard;
