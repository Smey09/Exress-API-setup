import React from "react";
import CountdownTimer from "./components/CountdownTimer"; // Adjust the path based on your file structure

const App: React.FC = () => {
  const goldTime = "28 Sep 2024 6:30:00";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <CountdownTimer goldTime={goldTime} />
    </div>
  );
};

export default App;
