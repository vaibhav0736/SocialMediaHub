import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, getUnreadCount, markNotificationRead, markAllRead } from '../api';
import { useAuth } from '../context/AuthContext';

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = useAuth();

    const fetchNotifications = () => {
        if (!user) return;
        getNotifications(user.id).then(setNotifications).catch(() => {});
        getUnreadCount(user.id).then(data => setUnreadCount(data.count)).catch(() => {});
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleNotificationClick = async (notif) => {
        if (!notif.is_read) {
            await markNotificationRead(notif.id);
            setUnreadCount(prev => prev - 1);
            setNotifications(prev =>
                prev.map(n => n.id === notif.id ? { ...n, is_read: 1 } : n)
            );
        }
        setShowDropdown(false);
    };

    const handleMarkAllRead = async () => {
        await markAllRead(user.id);
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    };

    const getLink = (notif) => {
        if (notif.type === 'follow') return `/users/${notif.actor_id}`;
        return `/posts/${notif.post_id}`;
    };

    if (!user) return null;

    return (
        <div className="notification-bell" ref={dropdownRef}>
            <button className="bell-btn" onClick={() => setShowDropdown(!showDropdown)}>
                🔔
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {showDropdown && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="mark-all-read">
                                Mark all read
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="notification-empty">No notifications yet</div>
                    ) : (
                        notifications.map(notif => (
                            <Link
                                key={notif.id}
                                to={getLink(notif)}
                                className={`notification-item ${notif.is_read ? '' : 'unread'}`}
                                onClick={() => handleNotificationClick(notif)}
                            >
                                {notif.actor_avatar ? (
                                    <img src={notif.actor_avatar} alt="" className="notif-avatar" />
                                ) : (
                                    <div className="notif-avatar avatar-placeholder">
                                        {notif.actor_username[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="notif-text">
                                    <p>{notif.message}</p>
                                    <span className="notif-time">
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                {!notif.is_read && <div className="notif-dot" />}
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
