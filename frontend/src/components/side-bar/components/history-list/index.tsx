import { Button, Divider, Form, List, Mentions } from 'antd';
import React from 'react';
import { DIRECTIONS } from '../../../../constants';
import { SocketContext } from '../../../../context/socket';
import { RoomEvents } from '../../../../enums';
import { HistoryType, RoomInfoType } from '../../../../types/types';

import styles from './styles.module.scss';

type PrefixType = keyof typeof DIRECTIONS;
type Properties = {
  currentRoom: RoomInfoType | undefined;
  userName: string | null;
};

export const HistoryList: React.FC<Properties> = ({
  currentRoom,
  userName,
}) => {
  const socket = React.useContext(SocketContext);
  const messageRef = React.useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const [prefix, setPrefix] = React.useState<PrefixType>('/');
  const [value, setValue] = React.useState<string>('');

  const onSearch = (_: string, newPrefix: string) => {
    setPrefix(newPrefix as PrefixType);
  };

  const direcctionComand = DIRECTIONS[prefix].map((item) => `/${item}`);

  const isCommand = (value: string) => {
    if (value) {
      return value
        .trim()
        .split(' ')
        .every((item) => direcctionComand.includes(item));
    }
    return false;
  };

  const directionOff = () => {
    const findPlayer = currentRoom?.players.find(player => player.name === userName);

    if (!currentRoom?.isGameStarted || !findPlayer?.canMove) return !isCommand(value);
    else return true;
  };

  const checkMention = async (_: unknown, value: string) => {
    const valuesArr = value?.trim().split(' ');

    if (isCommand(value) && valuesArr.length !== 0 && valuesArr.length > 1) {
      throw new Error();
    }
  };

  const onFinish = async () => {
    const { input } = await form.validateFields();

    if (input.trim() && directionOff()) {
      socket.emit(RoomEvents.HISTORY, input, currentRoom?.id, userName);
      setValue('');
      form.resetFields();
    }
  };

  const listItemStyle = (item: HistoryType) => {
    if (item.playerName === userName) {
      return `${styles.listItem} ${styles.flexReverse}`
    } else return styles.listItem;
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
          renderItem={(item) => (
            <List.Item className={listItemStyle(item)}>
              <p>{item.time}</p>
              <div className={styles.listText}>
                <span>{item.playerName === userName ? 'you' : item.playerName}: </span>
                <span>{item.text}</span>
              </div>
            </List.Item>
          )}
        />
      </div>
      <Form
        form={form}
        onFinish={onFinish}
        className={styles.formContainer}
        name="chat-form"
      >
        <Form.Item
          name="input"
          rules={[
            {
              validator: checkMention,
              message: 'Only one move!',
            },
            { required: true, message: 'Field is required' },
          ]}
        >
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
            onChange={(text) => setValue(text.trim())}
          />
        </Form.Item>
        <Form.Item name="button">
          <Button
            htmlType="submit"
            type="primary"
            block
            disabled={!directionOff()}
          >
            Send
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
