"use client";

import React, { useEffect, useState } from "react";

// Define the props for the CountdownTimer
interface CountdownTimerProps {
  goldTime: string; // Target gold time in "DD MMM YYYY HH:MM:SS" format
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ goldTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Function to format the current time into "DD MMM YYYY HH:MM:SS"
  const formatTime = (time: Date) => {
    return time.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Function to calculate the time left until the gold time
  const calculateTimeLeft = () => {
    const now = new Date();
    setCurrentTime(now);

    // Parse the gold time into a Date object
    const targetTime = new Date(goldTime);

    // Calculate the difference in milliseconds
    const diff = targetTime.getTime() - now.getTime();

    // If the target time is in the past, set time left to "00:00:00"
    if (diff <= 0) {
      setTimeLeft("00:00:00");
      return;
    }

    // Calculate days, hours, minutes, and seconds left
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    // Set the formatted time left
    setTimeLeft(
      `${days}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    );
  };

  // Use effect to update the current time and time left every second
  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [goldTime]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-700 to-indigo-800 text-white rounded-lg shadow-xl space-y-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white tracking-wide bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
        Countdown Timer
      </h2>
      <div className="flex flex-col items-center space-y-2">
        <span className="text-lg font-medium text-gray-200">Current Time:</span>
        <span className="text-xl font-mono bg-gray-900 px-4 py-2 rounded-lg shadow-md text-yellow-300">
          {formatTime(currentTime)}
        </span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <span className="text-lg font-medium text-gray-200">
          Time Left Until Gold Time:
        </span>
        <span className="text-3xl font-mono bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white px-8 py-4 rounded-lg shadow-md">
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
