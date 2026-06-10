import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import ChangePassword from './pages/ChangePassword';
import PostDetail from './pages/PostDetail';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
            <BrowserRouter>
                <div className="app">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Feed />
                                </ProtectedRoute>
                            } />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/create" element={
                                <ProtectedRoute>
                                    <CreatePost />
                                </ProtectedRoute>
                            } />
                            <Route path="/users/:id" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path="/posts/:id" element={
                                <ProtectedRoute>
                                    <PostDetail />
                                </ProtectedRoute>
                            } />
                            <Route path="/change-password" element={
                                <ProtectedRoute>
                                    <ChangePassword />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
