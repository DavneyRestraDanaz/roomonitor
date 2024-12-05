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

// More Thematic and Detailed Custom Icons
const Icons = {
  Thermometer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
      <line x1="12" y1="12" x2="12.01" y2="12"/>
    </svg>
  ),
  Humidity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
      <path d="M8 13a4 4 0 0 0 8 0"/>
    </svg>
  ),
  Motion: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6A5ACD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"/>
      <path d="M12 12v4"/>
      <path d="M16 16h4"/>
      <path d="M4 12h4"/>
      <circle cx="12" cy="16" r="2" fill="#6A5ACD"/>
    </svg>
  ),
  Water: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3498DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a9 9 0 0 1-9-9c0-2 0.5-3.5 1-5c1.5-3 3.5-5.5 9-11c5.5 5.5 7.5 8 9 11c0.5 1.5 1 3 1 5a9 9 0 0 1-9 9z"/>
      <path d="M8 14c2.5 2 5.5 2 8 0"/>
    </svg>
  ),
  Fire: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12c2-3 1-5-1-7c-1.5 1.5-3 3.5-3 5.5a4 4 0 0 0 8 0c0-1.5-1-4-2-5.5c-2 2-3 4-1 7z"/>
      <path d="M12 22a5 5 0 0 0 3-2a5 5 0 0 0-3-5a5 5 0 0 0-3 5a5 5 0 0 0 3 2z"/>
    </svg>
  ),
};

const SensorDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("https://api-x-six.vercel.app/api/sensors");
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

  const renderSensorCard = (Icon, title, value, status, detailContent) => (
    <div 
      onClick={() => setSelectedSensor({title, detailContent})}
      className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl 
        transition-all duration-300 transform hover:scale-105 p-6 
        relative overflow-hidden border-2 border-gray-100 
        hover:border-blue-200 cursor-pointer space-y-4
        ${status ? 'animate-pulse-border' : ''}`}
    >
      
      <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 
        transition-opacity scale-150 z-0">
        <Icon />
      </div>
      
      <div className="flex justify-between items-center z-10 relative">
        <div className={`p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 
          transition-colors flex items-center justify-center
          ${status ? 'animate-pulse' : ''}`}>
          <Icon />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className={`text-xs ${status ? 'text-green-600 animate-pulse' : 'text-red-600'}`}>
          {status ? 'Active' : 'Inactive'}
        </p>
      </div>
    </div>
  );

  // Sensor Detail Modal
  const SensorModal = ({ sensor, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{sensor.title} Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          {sensor.detailContent}
        </div>
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
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Fetch Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  const latestData = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Sensor Detail Modal */}
      {selectedSensor && (
        <SensorModal 
          sensor={{
            ...selectedSensor,
            detailContent: selectedSensor.title === "Motion Sensor" ? (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800">
                  Motion detected in the <strong>Living Room</strong>
                </p>
                <p className="text-sm text-yellow-600 mt-2">
                  Detected at: {latestData?.timestamp}
                </p>
                <div className="mt-4 bg-yellow-100 p-3 rounded-md">
                  <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                    Additional Information
                  </h3>
                  <p className="text-xs text-yellow-700">
                    • Sensor Range: 10 meters
                    • Sensitivity: High
                    • Last Triggered: Just now
                  </p>
                </div>
              </div>
            ) : (
              <p>No additional details available.</p>
            )
          }}
          onClose={() => setSelectedSensor(null)} 
        />
      )}
      <div className="container mx-auto max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 space-y-4 md:space-y-0">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center md:text-left">
            Smart Sensor Dashboard
          </h1>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-semibold text-gray-800">
              {latestData?.timestamp || 'N/A'}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
          {renderSensorCard(
            Icons.Thermometer,
            "Temperature",
            `${latestData?.temperature || 'N/A'}`,
            true,
            <div>Temperature details</div>
          )}
          {renderSensorCard(
            Icons.Humidity,
            "Humidity",
            `${latestData?.humidity || 'N/A'}`,
            true,
            <div>Humidity details</div>
          )}
          {renderSensorCard(
            Icons.Water,
            "Water Sensor",
            latestData?.waterSensor ? "Detected" : "No Water",
            !!latestData?.waterSensor,
            <div>Water sensor details</div>
          )}
          {renderSensorCard(
            Icons.Motion,
            "Motion Sensor",
            latestData?.motionSensor ? "Motion" : "No Motion",
            !!latestData?.motionSensor,
            // Detailed motion sensor content added above in SensorModal
            <div>Motion sensor details</div>
          )}
          {renderSensorCard(
            Icons.Fire,
            "Fire Sensor",
            latestData?.apiSensor ? "Detected" : "Not Detected",
            !!latestData?.apiSensor,
            <div>Fire sensor details</div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6 md:mb-8">
            Sensor Analytics
          </h2>
          <ResponsiveContainer width="100%" height={300} className="md:h-[400px]">
            <LineChart data={data}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                strokeOpacity={0.7} 
              />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fill: "#666666" }}
                className="text-xs"
              />
              <YAxis 
                tick={{ fill: "#666666" }}
                className="text-xs"
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