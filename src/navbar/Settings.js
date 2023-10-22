import React from "react";
import SettingsInfo from "../components/SettingsInfo.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const Settings = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Settings" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <SettingsInfo />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Settings;
