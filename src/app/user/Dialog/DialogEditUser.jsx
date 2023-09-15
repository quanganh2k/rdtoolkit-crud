"use client";

import { Modal } from "antd";
import React from "react";

const DialogEditUser = (props) => {
  //! State
  const { open, title, content, okText, cancelText, onOk, onCancel, userId } =
    props;

  //! Function

  //! Render
  return (
    <Modal
      title={title}
      centered
      open={open}
      cancelText={cancelText || "Cancel"}
      okText={okText || "Ok"}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
    >
      {content}
    </Modal>
  );
};

export default DialogEditUser;
