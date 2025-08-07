import React, { FC } from 'react';
import type { Chat } from '../types';

interface ChatListItemProps {
  chat: Chat;
  onClick: (id: string) => void;
  isActive: boolean;
}

const ChatListItem: FC<ChatListItemProps> = ({ chat, onClick, isActive }) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (!lastMessage) return null;

    const date = new Date(parseInt(lastMessage.timestamp) * 1000);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div
            className={`flex items-center p-0 cursor-pointer ${isActive ? 'bg-gray-200 dark:bg-[#202c33]' : 'bg-white dark:bg-[#111b21]'} hover:bg-gray-100 dark:hover:bg-[#202c33]`}
            onClick={() => onClick(chat.wa_id)}
        >
            <div className="p-3 flex-shrink-0">
                <img className="w-12 h-12 rounded-full object-cover" src={`https://placehold.co/100x100/EBF0F3/808080?text=${chat.name.charAt(0)}`} alt="avatar" />
            </div>
            <div className="flex-1 border-b border-gray-200 dark:border-[#202c33] py-3 pr-3 min-w-0">
                <div className="flex justify-between">
                    <h2 className="text-base font-medium text-gray-800 dark:text-gray-100 truncate">{chat.name}</h2>
                    <p className={`text-xs flex-shrink-0 ${isActive ? 'text-gray-600 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>{time}</p>
                </div>
                <div className="flex items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">{lastMessage.text.body}</p>
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;