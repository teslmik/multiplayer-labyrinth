import { Modal } from 'antd';
import React from 'react';
import { ModalType } from '../../enums';

export const ModalApp = (
  title: React.ReactNode,
  content: React.ReactNode,
  type: ModalType
) => {
  const { warning, info } = Modal;

  if (type === ModalType.WARNING) {
    warning({ title, content });
    sessionStorage.clear();
  } else if (type === ModalType.INFO) {
    info({ title, content });
  }
};
