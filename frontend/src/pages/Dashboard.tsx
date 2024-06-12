import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

// Define types for messages
interface Message {
  username: string;
  message: string;
}

interface SystemMessage {
  event: string;
  data: any;
}

export const Dashboard: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<SystemMessage[]>([]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Prevent form submission or any other default action
      sendMessage();
    }
  };

  useEffect(() => {
    const ws = new WebSocket('wss://cpegleb.onrender.com');

    const storedUsername = localStorage.getItem('username') || '';
    setUsername(storedUsername);

    ws.onopen = () => {
      console.log('WebSocket is open now.');
    };

    ws.onmessage = (event: MessageEvent) => {
      const data: SystemMessage = JSON.parse(event.data);

      if (data.event === 'messageReceive') {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, data.data];
          return newMessages.slice(-8);
        });
      } else {
        setReceivedMessages((prevMessages) => {
          const newMessages = [...prevMessages, data];
          return newMessages.slice(-8);
        });
      }

      console.log('Received message:', data);
    };

    ws.onclose = () => {
      console.log('WebSocket is closed now.');
    };

    ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendEvent = (eventType: string, eventData: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ event: eventType, data: eventData }));
    } else {
      console.error('WebSocket connection is not open.');
    }
  };

  const handleRegister = () => {
    if (username) {
      sendEvent('register', { username });
    } else {
      console.error('Username is required.');
    }
  };

  const handleStartCompetition = () => {
    if (!username) {
      console.error('No username found. Please register first.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    axios.post('https://cpegleb.onrender.com/api/v1/addqueue', {
      username: username
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Competition started successfully:', response.data);
    })
    .catch(error => {
      console.error('Error starting competition:', error);
    });
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') {
      console.error('Cannot send an empty message.');
      return;
    }
    if (!username) {
      console.error('Username is not set.');
      return;
    }
    const msg: Message = { username: username, message: newMessage };
    console.log('Sending message:', msg); 
    setMessages([...messages, msg].slice(-8));
    sendEvent('messageSend', msg);
    setNewMessage('');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex justify-between items-center p-4 h-[10%] bg-white">
        <h1 className="text-2xl font-bold">CPegle</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </nav>
      <div className="flex flex-col min-h-screen bg-gray-100 p-4">
        <div className="flex flex-grow">
          <div className="w-full lg:w-1/2 p-4">
            <div className="w-full bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col mb-4">
                <button
                  onClick={handleRegister}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                >
                  Register
                </button>
                <button
                  onClick={handleStartCompetition}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-2"
                >
                  Start Competition
                </button>
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">System Messages</h2>
                <ul className="space-y-2">
                  {receivedMessages.map((msg, index) => (
                    <li key={index} className="p-2 bg-gray-200 rounded">
                      {JSON.stringify(msg)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-4">
            <div className="w-full bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
              <h2 className="text-lg font-semibold mb-2">User Messaging</h2>
              <div className="flex-grow overflow-y-auto bg-gray-200 p-2 rounded mb-4">
                <ul className="space-y-2">
                  {messages.map((msg, index) => (
                    <li key={index} className="bg-gray-300 p-2 rounded">
                      <strong>{msg.username}:</strong> {msg.message}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow p-2 border border-gray-300 rounded mr-2"
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
