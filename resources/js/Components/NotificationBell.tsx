import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

interface Message {
    id: number;
    title: string;
    body: string;
    type: 'individual' | 'broadcast';
    is_read: boolean;
    created_at: string;
}

interface MessagesResponse {
    messages: {
        data: Message[];
    };
    unread_count: number;
}

const TOKEN_KEY = 'auth_system_token';

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasToken, setHasToken] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getToken = () => localStorage.getItem(TOKEN_KEY);

    useEffect(() => {
        const token = getToken();
        if (!token) return;
        setHasToken(true);

        fetchUnreadCount(token);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function fetchUnreadCount(token: string) {
        try {
            const res = await fetch('/api/messages', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const data: MessagesResponse = await res.json();
            setUnreadCount(data.unread_count);
            setMessages(data.messages.data);
        } catch {
            // Silently fail — user may not be authenticated
        }
    }

    async function fetchMessages() {
        const token = getToken();
        if (!token) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/messages', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const data: MessagesResponse = await res.json();
            setUnreadCount(data.unread_count);
            setMessages(data.messages.data);
        } catch {
            // Silently fail
        } finally {
            setIsLoading(false);
        }
    }

    async function markRead(id: number) {
        const token = getToken();
        if (!token) return;
        try {
            const res = await fetch(`/api/messages/${id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch {
            // Silently fail
        }
    }

    async function markAllRead() {
        const token = getToken();
        if (!token) return;
        try {
            const res = await fetch('/api/messages/read-all', {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
                setUnreadCount(0);
            }
        } catch {
            // Silently fail
        }
    }

    function handleBellClick() {
        if (!isOpen) {
            fetchMessages();
        }
        setIsOpen(!isOpen);
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }

    if (!hasToken) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleBellClick}
                className="relative rounded-full p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-gray-400">Loading...</div>
                        ) : messages.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">No messages</div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`cursor-pointer border-b border-gray-50 px-4 py-3 transition-colors hover:bg-gray-50 ${!message.is_read ? 'bg-blue-50/50' : ''}`}
                                    onClick={() => !message.is_read && markRead(message.id)}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                {!message.is_read && (
                                                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                                                )}
                                                <p className={`truncate text-sm ${!message.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                    {message.title}
                                                </p>
                                            </div>
                                            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                                                {message.body}
                                            </p>
                                        </div>
                                        <span className="flex-shrink-0 text-[10px] text-gray-400">
                                            {formatDate(message.created_at)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
