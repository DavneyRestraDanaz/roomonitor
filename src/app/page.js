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

// Custom Icons with Vibrant Colors
const Icons = {
  Thermometer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
      <line x1="12" y1="12" x2="12.01" y2="12"/>
    </svg>
  ),
  Humidity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
    </svg>
  ),
  Motion: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"/>
      <path d="M12 12v4"/>
      <path d="M16 16h4"/>
      <path d="M4 12h4"/>
    </svg>
  ),
  Water: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3498DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.42 10.922a2 2 0 0 1-1.56-1.22A5.48 5.48 0 0 0 14.88 6c-.61 0-1.21.1-1.77.28a2 2 0 0 1-2.22-.52l-1.27-1.4a2 2 0 0 1 0-2.64L9.12 2"/>
      <path d="m12 3-1.29 1.29a2 2 0 0 0 0 2.82l5.58 5.58a2 2 0 0 1 0 2.83l-8.58 8.59a2 2 0 1 1-2.83-2.83l8.58-8.58a2 2 0 0 0 0-2.83L10.71 5.7"/>
    </svg>
  ),
  Api: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9C27B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m15 9-6 6"/>
      <path d="m9 9 6 6"/>
    </svg>
  ),
};

const SensorDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/sensors");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const sensorData = await response.json();

        const processedData = sensorData.map((item) => ({
          timestamp: new Date(item.created_at).toLocaleTimeString(),
          temperature: item.temperature,
          humidity: item.humidity,
          waterSensor: item.water_sensor,
          motionSensor: item.sensor_pir,
          apiSensor: !!item.sensor_api,
        }));

        setData(processedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const renderSensorCard = (Icon, title, value, status, trend) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl 
      transition-all duration-300 transform hover:scale-105 p-5 
      relative overflow-hidden border-2 border-gray-100 
      hover:border-blue-200 cursor-pointer">
      
      <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 
        transition-opacity scale-150">
        <Icon />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 
          transition-colors flex items-center justify-center">
          <Icon />
        </div>
        
        <div className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-sm font-medium ml-2">
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className={`text-xs mt-1 ${status ? 'text-green-600' : 'text-red-600'}`}>
          {status ? 'Active' : 'Inactive'}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 mb-4"></div>
          <p className="text-gray-800 text-xl">Loading Sensor Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Fetch Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  const latestData = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Smart Sensor Dashboard
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-semibold text-gray-800">
              {latestData?.timestamp || 'N/A'}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {renderSensorCard(
            Icons.Thermometer,
            "Temperature",
            `${latestData?.temperature || 'N/A'}°C`,
            true,
            1.5
          )}
          {renderSensorCard(
            Icons.Humidity,
            "Humidity",
            `${latestData?.humidity || 'N/A'}%`,
            true,
            -0.5
          )}
          {renderSensorCard(
            Icons.Water,
            "Water Sensor",
            latestData?.waterSensor ? "Detected" : "No Water",
            !!latestData?.waterSensor,
            latestData?.waterSensor ? 2 : -1
          )}
          {renderSensorCard(
            Icons.Motion,
            "Motion Sensor",
            latestData?.motionSensor ? "Motion" : "No Motion",
            !!latestData?.motionSensor,
            latestData?.motionSensor ? 1 : 0
          )}
          {renderSensorCard(
            Icons.Api,
            "API Status",
            latestData?.apiSensor ? "Connected" : "Disconnected",
            !!latestData?.apiSensor,
            latestData?.apiSensor ? 1 : -1
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Sensor Analytics
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                strokeOpacity={0.7} 
              />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fill: "#666666" }}
              />
              <YAxis 
                tick={{ fill: "#666666" }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: "12px",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.1)"
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#FF4D4D" 
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="#4ECDC4" 
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard;