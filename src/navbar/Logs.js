import React from "react";
import LogsGrid from "../datagrid/LogsGrid.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const Logs = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="Logs" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <LogsGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Logs;
