import { Button, Divider, Form, List, Mentions } from 'antd';
import React from 'react';
import { DIRECTIONS } from '../../../../constants';
import { SocketContext } from '../../../../context/socket';
import { RoomEvents } from '../../../../enums';
import { RoomInfoType } from '../../../../types/types';

import styles from './styles.module.scss';

type PrefixType = keyof typeof DIRECTIONS;
type Properties = {
  currentRoom: RoomInfoType | undefined;
  userName: string | null;
};

export const HistoryList: React.FC<Properties> = ({ currentRoom, userName }) => {
  const socket = React.useContext(SocketContext);
  const [form] = Form.useForm();
  const [prefix, setPrefix] = React.useState<PrefixType>('/');
  const [value, setValue] = React.useState<string>('')
  const messageRef = React.useRef<HTMLDivElement>(null);

  const onSearch = (_: string, newPrefix: string) => {
    setPrefix(newPrefix as PrefixType);
  };


  const onFinish = () => {
    if (value.trim()) {
      socket.emit(RoomEvents.HISTORY, value, currentRoom?.id, userName);
      setValue('');
      form.resetFields();
    }
  };

  React.useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [currentRoom?.history]);

  return (
    <div className={styles.historyContainer}>
      <Divider orientation="center">History logs</Divider>
      <div ref={messageRef} className={styles.listContainer}>
        <List
          className={styles.listItems}
          size="small"
          dataSource={currentRoom?.history}
          renderItem={
            (item) =>
              <List.Item className={styles.listItem}>
                <p>{item.time}</p>
                <div className={styles.listText}>
                  <span>{item.playerName}:{' '}</span>
                  <span>{item.text}</span>
                </div>
              </List.Item>
          }
        />
      </div>
      <Form form={form} onFinish={onFinish} className={styles.formContainer} name="chat-form">
        <Form.Item name="input">
          <Mentions
            autoFocus
            rows={1}
            placeholder="input / to select an action"
            prefix={'/'}
            onSearch={onSearch}
            options={(DIRECTIONS[prefix] || []).map((value) => ({
              key: value,
              value,
              label: value,
            }))}
            value={value}
            onChange={setValue}
          />
        </Form.Item>
        <Form.Item name="button">
          <Button htmlType="submit" type="primary" block>Send</Button>
        </Form.Item>
      </Form>
    </div>
  )
};
