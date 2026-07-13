import React from "react";
import "./LoaderSpinner.css";

const LoaderSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="loader-wrapper">
      <div className="loader-spinner" />
      <p>{label}</p>
    </div>
  );
};

export default LoaderSpinner;
