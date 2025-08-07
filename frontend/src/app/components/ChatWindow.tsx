// components/ChatWindow.tsx
import React, { useState, useEffect, useRef, FC, KeyboardEvent } from 'react';
import { ArrowLeft, Paperclip, SendHorizontal, Smile } from 'lucide-react';
import type { Chat } from '../types';
import StatusIcon from './StatusIcon';

interface ChatWindowProps {
  chat: Chat | null;
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

const ChatWindow: FC<ChatWindowProps> = ({ chat, onSendMessage, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (chat) {
          scrollToBottom();
        }
    }, [chat?.messages]);

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };
    
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    if (!chat) {
        return (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-100 dark:bg-[#111b21] text-center p-4 border-l border-gray-200 dark:border-gray-700">
                <img src="https://cdn-icons-png.flaticon.com/512/4423/4423697.png" alt="Select a chat" className="w-52 h-52 opacity-30 dark:opacity-100" />
                <h2 className="text-2xl mt-4 text-gray-700 dark:text-gray-300">WhatsApp Web Clone</h2>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Select a conversation to start messaging.</p>
                <p className="text-gray-600 dark:text-gray-600 mt-10 text-sm">Build by Yuvraj 🚀</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-repeat bg-center bg-[#EFEAE2] dark:bg-[#0b141a] dark:bg-[#111b21] h-screen">
            <header className="flex items-center p-2.5 bg-gray-100 dark:bg-[#202c33] flex-shrink-0 z-10 shadow-sm">
                <button onClick={onBack} className="md:hidden p-2 -ml-1 mr-2 text-gray-600 dark:text-gray-300">
                    <ArrowLeft size={22} />
                </button>
                <img className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0" src={`https://placehold.co/100x100/3d4a55/EBF0F3?text=${chat.name.charAt(0)}`} alt="avatar" />
                <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate">{chat.name}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.wa_id}</p>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="flex flex-col space-y-2">
                    {chat.messages.map((msg) => {
                         const date = new Date(parseInt(msg.timestamp) * 1000);
                         const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                         const isSentByMe = msg.from !== chat.wa_id;

                        return (
                            <div key={msg.id} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md p-2 rounded-lg text-sm shadow-sm ${isSentByMe ? 'bg-[#d9fdd3] dark:bg-[#005c4b]' : 'bg-white dark:bg-[#202c33]'}`}>
                                    <p className="text-gray-800 dark:text-gray-100 pr-2">{msg.text.body}</p>
                                    <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-end items-center">
                                        {time}
                                        {isSentByMe && <div className="w-4 h-4 ml-1"><StatusIcon status={msg.status} /></div>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="p-2 bg-gray-100 dark:bg-[#202c33] flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <Smile className="text-gray-500 dark:text-gray-400" size={24} />
                    <Paperclip className="text-gray-500 dark:text-gray-400" size={24} />
                    <input
                        type="text"
                        className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg py-2 px-4 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                        placeholder="Type a message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSend} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                        <SendHorizontal size={24} />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatWindow;