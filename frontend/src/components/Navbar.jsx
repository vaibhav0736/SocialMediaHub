import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

function Navbar() {
    const { user, logout } = useAuth();
    const {theme,toggleTheme}=useTheme();

    return (
        <nav className="navbar">
            <h1>Social Hub</h1>
            <SearchBar />
            <NotificationBell />
            <div className="nav-links">
                <Link to="/">Feed</Link>

                {user ? (
                    <>
                        <Link to="/create">New Post</Link>
                        <Link to={`/users/${user.id}`}>{user.username}</Link>
                          <Link to="/change-password">Change Password</Link>
                        <Link to="/" onClick={logout}>Logout</Link>
                      
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                <button onClick={toggleTheme} className='theme-toggle'>
                                       {theme === 'light' ? '🌙' : '☀️'}

                </button>
            </div>
        </nav>
    );
}

export default Navbar;
