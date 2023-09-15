"use client";

import React, { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastifyProviver = ({ children }) => {
  return (
    <Fragment>
      {children}
      <ToastContainer theme="light" />
    </Fragment>
  );
};

export default ToastifyProviver;
