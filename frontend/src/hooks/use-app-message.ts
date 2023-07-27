import { message } from 'antd';

export const useAppMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const appMessage = (
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' | 'loading',
  ) => {
    switch (type) {
      case 'info':
        messageApi.info(message);
        break;
      case 'success':
        messageApi.success(message);
        break;
      case 'error':
        messageApi.error(message);
        break;
      case 'warning':
        messageApi.warning(message);
        break;
      case 'loading':
        messageApi.loading(message);
        break;
      default:
        break;
    }
  };

  return { contextHolder, appMessage };
};