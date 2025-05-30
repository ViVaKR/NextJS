'use client';

import { Box, TextField } from '@mui/material';
import styles from './Chat.module.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { IChatUser } from '@/interfaces/i-chat-user';
import { IChatMessage } from '@/interfaces/i-chat-message';
import { IFileInfo } from '@/interfaces/i-file-info';
import { useProfile } from '@/app/(root)/membership/profile/Profile';
import { apiFetch } from '@/lib/api';
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import WifiOffOutlinedIcon from '@mui/icons-material/WifiOffOutlined';

export default function ChatPage() {

  const hubUrl = process.env.NEXT_PUBLIC_CHAT_URL;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [userAvata, setAvata] = useState<IFileInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>(); // 입력값 상태
  const [rows, setRows] = useState(2);
  const [hubConnection, setHubConnection] = useState<
    signalR.HubConnection | undefined | null
  >();
  const [currentUser, setCurrentUser] = useState<IChatUser>({
    userId: 'Guest',
    userName: 'Guest',
  });
  const { user, isLoading: profileLoading, error: profileError } = useProfile();
  const [status, setStatus] = useState('연결중...');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const endPoint = '/chatHub';
  const defaultImage = '/login-icon.png';
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${hubUrl}${endPoint}`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();

    let isMounted = true; // 컴포넌트 마운트 상태 추적

    connection.on('FullReceived', (message: IChatMessage) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(() => {
        scrollToBottom();
      }, 10);
    });

    connection
      .start()
      .then(() => {
        if (isMounted) {
          setStatus('연결');
          setHubConnection(connection);
        }
      })
      .catch((err) => {
        if (isMounted) setStatus(`-`);
      });

    return () => {
      isMounted = false;
      connection.off('FullReceived');
      setHubConnection(undefined);
    };
  }, [hubUrl]); // 빈 배열 유지

  useEffect(() => {
    if (profileLoading) return;

    if (user) {
      setCurrentUser({ userId: user.id, userName: user.fullName });
      fetchAvata();
    } else {
      setCurrentUser({ userId: 'Guest', userName: 'Guest' });
      setAvata(null);
      setIsLoading(false);
    }

  }, [user, profileLoading]);

  // *
  const getAvataUrl = () => {
    if (!user || !userAvata?.dbPath) return '/images/login-icon.png';
    const avataUrl = `${baseUrl}/images/${user.id}_${userAvata.dbPath}`;

    return avataUrl;
  };

  // * check who
  const isMe = (id: string) => {
    return currentUser.userId === id;
  };

  const fetchAvata = async () => {
    const controller = new AbortController();
    try {
      const result = await apiFetch('/api/FileManager/GetUserImage', {
        signal: controller.signal,
      });
      if (!result) return;
      const isAvata = (data: any): data is IFileInfo => 'dbPath' in data;
      if (isAvata(result)) setAvata(result);
      setError(null);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching avatar:', err);
        setError('Failed to load Avata. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
    return () => controller.abort();
  };

  // 메시지 전송
  const sendMessage = () => {
    if (
      !hubConnection ||
      hubConnection.state !== 'Connected' ||
      !messageInput?.trim()
    )
      return;

    const message: IChatMessage = {
      roomId: 10001,
      userId: currentUser.userId,
      userName: currentUser.userName,
      message: messageInput,
      avata: getAvataUrl(),
      sendTime: new Date(),
    };

    hubConnection.invoke('NewMessage', message)
      .then(() => {
        setMessageInput('');
        setRows(2);
      })
      .catch((err) => {
        setStatus(`전송실패: ${err.message}`);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const spaces = '    ';
      const newValue =
        messageInput?.substring(0, start) +
        spaces +
        messageInput?.substring(end);
      setMessageInput(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  // 클립보드 복사 함수
  const copyMessages = async () => {
    try {
      //--> Option 1: JSON 형식으로 복사 (Angular처럼)
      //--> Option 2: 읽기 쉬운 텍스트 형식으로 복사
      const textToCopy = messages
        .map((msg) => `${msg.userName} (${new Date(msg.sendTime).toLocaleString()}): ${msg.message}`)
        .join('\n');

      await navigator.clipboard.writeText(textToCopy);
      setStatus('대화 내용이 클립보드에 복사되었습니다!');
      setTimeout(() => setStatus('연결성공'), 2000);
    } catch (err) {
      setStatus('복사 실패: 클립보드 접근 권한을 확인하세요.');
    }
  };

  //--> Start Point
  return (
    <>
      <div className={`${styles.chatClientContainer} relative w-full h-screen`}>
        <div className="absolute top-6 text-xs">{status === '연결' ? (
          <WifiOutlinedIcon sx={{ color: 'yellowgreen' }} />
        ) : (
          <WifiOffOutlinedIcon color='warning' />
        )}</div>
        <div
          className={`${styles.chatContainer} w-[90%] absolute`}
          ref={chatContainerRef}>
          <ul className={`${styles.chat} !py-2`}>
            {messages.map((message, index) => (
              <li
                key={index}
                className={`${styles.message} ${isMe(message.userId) ? styles.left : styles.right
                  } `}>
                <div
                  className={`${isMe(message.userId)
                    ? 'flex items-center'
                    : 'flex flex-row-reverse items-center'
                    }`}>
                  <Image
                    src={message.avata || defaultImage}
                    width={50}
                    height={50}
                    className={`${styles.logo}`}
                    alt="avatar"
                  />
                  <div className="flex flex-col">
                    <p
                      className={`!text-sm !text-slate-500 font-bold ${isMe(message.userId)
                        ? 'text-end pr-4'
                        : 'text-start pl-4'
                        } `}>
                      {message.userName}
                    </p>
                    <p className="!text-sm !text-slate-400">
                      {new Date(message.sendTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <pre className={styles.pre}>
                  <code
                    className={`${isMe(message.userId)
                      ? 'flex justify-start pl-2 text-teal-700'
                      : 'flex justify-end text-amber-900'
                      } !text-base !p-0 !m-0`}>
                    {message.message}
                  </code>
                </pre>
              </li>
            ))}
          </ul>
        </div>
        {/* footer */}
        <footer className={`${styles.footer}`}>
          <div
            className="flex flex-col justify-center
                items-center left-0 right-0 max-h-screen
                absolute
                bottom-0">
            <Box
              component="form"
              className="w-full text-white absolute bottom-48"
              noValidate
              autoComplete="off">
              {/* 텍스트 입력 */}
              <div className="px-4">
                <TextField
                  id="filled-multiline-static"
                  name="filled-multiline-static"
                  label="Message"
                  focused
                  multiline
                  fullWidth
                  variant="filled"
                  rows={5}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)} // 입력값 업데이트
                  onKeyDown={handleKeyDown} // Enter 키로 전송
                  sx={{
                    '& .MuiFilledInput-root': {
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    },
                    '& .MuiInputLabel-filled': {
                      color: '#fff !important',
                      fontWeight: 'bold',
                    },
                  }}
                  defaultValue=""
                />
              </div>
            </Box>

            <div
              className="flex
                      justify-around
                      w-full
                      text-white
                      absolute mb-72">
              <button
                onClick={() => setMessages([])}
                className="px-4 py-2
                            cursor-pointer
                            rounded-full
                            my-4 bg-sky-500
                            hover:bg-sky-600">
                취소
              </button>
              <button
                onClick={copyMessages}
                className="px-4 py-2
                            cursor-pointer
                            rounded-full
                            my-4 bg-sky-500
                            hover:bg-sky-600">
                복사
              </button>
              <button
                onClick={sendMessage}
                className="px-4 py-2
                          cursor-pointer
                          rounded-full my-4
                          bg-sky-500
                          hover:bg-sky-600">
                전송
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
