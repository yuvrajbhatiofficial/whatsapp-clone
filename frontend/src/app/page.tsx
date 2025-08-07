// pages/index.tsx
"use client"
import React, { useState, useEffect, FC } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { Search } from 'lucide-react';
import type { Chats, Message } from './types';
import ChatListItem from './components/ChatListItem';
import ChatWindow from './components/ChatWindow';

const Home: FC = () => {
    const [chats, setChats] = useState<Chats>({});
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const API_URL = 'http://localhost:5001';

    useEffect(() => {
        const fetchChats = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get<{ [key: string]: Message[] }>(`${API_URL}/api/chats`);
                const chatsData = response.data;
                const formattedChats: Chats = {};
                for (const wa_id in chatsData) {
                    formattedChats[wa_id] = {
                        wa_id,
                        name: chatsData[wa_id][0].name,
                        messages: chatsData[wa_id],
                    };
                }
                setChats(formattedChats);
            } catch (err) {
                console.error("Error fetching chats:", err);
                setError("Failed to fetch chats. Make sure the backend server is running and accessible.");
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [API_URL]);

    const handleSendMessage = async (text: string) => {
        if (!activeChatId) return;

        const tempMessageId = `temp_${Date.now()}`;
        const newMessage: Message = {
            _id: tempMessageId,
            from: 'YOUR_BUSINESS_PHONE_NUMBER',
            id: tempMessageId,
            timestamp: String(Math.floor(Date.now() / 1000)),
            text: { body: text },
            type: 'text',
            status: 'sent',
            wa_id: activeChatId,
            name: chats[activeChatId].name,
        };

        setChats(prevChats => ({
            ...prevChats,
            [activeChatId]: {
                ...prevChats[activeChatId],
                messages: [...prevChats[activeChatId].messages, newMessage]
            }
        }));

        try {
            const response = await axios.post<Message>(`${API_URL}/api/messages`, {
                from: newMessage.from,
                text: newMessage.text.body,
                wa_id: newMessage.wa_id,
                name: newMessage.name,
            });
            const savedMessage = response.data;

            setChats(prevChats => {
                const newMessages = prevChats[activeChatId].messages.map(msg =>
                    msg.id === tempMessageId ? savedMessage : msg
                );
                return {
                    ...prevChats,
                    [activeChatId]: {
                        ...prevChats[activeChatId],
                        messages: newMessages,
                    },
                };
            });

        } catch (error) {
            console.error("Error sending message:", error);
             setChats(prevChats => ({
                ...prevChats,
                [activeChatId]: {
                    ...prevChats[activeChatId],
                    messages: prevChats[activeChatId].messages.filter(m => m.id !== tempMessageId)
                }
            }));
        }
    };

    const activeChat = activeChatId ? chats[activeChatId] : null;

    return (
        <>
            <Head>
                <title>WhatsApp Clone</title>
                <meta name="description" content="A WhatsApp Web Clone built with Next.js snd mongodb" />
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <div className="flex h-screen antialiased overflow-hidden">
                <div className={`w-full md:w-1/3 lg:w-1/4 flex flex-col bg-white dark:bg-[#111b21] border-r border-gray-200 dark:border-[#202c33] ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
                    <header className="p-2.5 bg-gray-100 dark:bg-[#202c33] flex-shrink-0 flex items-center gap-3">
                        <img className="w-10 h-10 rounded-full object-cover" src="https://placehold.co/100x100/EBF0F3/808080?text=Y" alt="user-avatar" />
                         <div className="relative flex-1">
                            <input type="text" placeholder="Search or start new chat" className="w-full bg-gray-200 dark:bg-[#2a3942] rounded-lg py-1.5 pl-10 pr-4 text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none" />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                <Search size={18} />
                            </div>
                        </div>
                    </header>
                    <div className="flex-1 overflow-y-auto">
                        {loading && <p className="p-4 text-gray-500 dark:text-gray-400">Loading chats...</p>}
                        {error && <p className="p-4 text-red-500">{error}</p>}
                        {!loading && !error && Object.values(chats).length === 0 && (
                            <p className="p-4 text-gray-500 dark:text-gray-400">No conversations found.</p>
                        )}
                        {!loading && !error && Object.values(chats).map(chat => (
                            <ChatListItem
                                key={chat.wa_id}
                                chat={chat}
                                onClick={() => setActiveChatId(chat.wa_id)}
                                isActive={activeChatId === chat.wa_id}
                            />
                        ))}
                    </div>
                </div>
                <div className={`flex-1 ${activeChatId ? 'flex' : 'hidden'} md:flex`}>
                   <ChatWindow chat={activeChat} onSendMessage={handleSendMessage} onBack={() => setActiveChatId(null)} />
                </div>
            </div>
        </>
    );
};

export default Home;