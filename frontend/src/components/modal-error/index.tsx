import { Modal } from 'antd';
import React from 'react';

export const ModalError = (
  title: React.ReactNode,
  content: React.ReactNode,
) => {
  Modal.warning({ title, content });
  sessionStorage.clear();

};
