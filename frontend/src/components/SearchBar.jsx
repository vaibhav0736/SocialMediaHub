import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchUsers } from '../api';

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (query.trim().length < 1) {
            setResults([]);
            return;
        }

        const timer = setTimeout(() => {
            searchUsers(query)
                .then(setResults)
                .catch(() => {});
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        function handleClick(e) {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="search-bar" ref={searchRef}>
            <input
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
            />

            {showResults && results.length > 0 && (
                <div className="search-results">
                    {results.map(user => (
                        <Link
                            key={user.id}
                            to={`/users/${user.id}`}
                            className="search-result-item"
                            onClick={() => {
                                setQuery('');
                                setShowResults(false);
                            }}
                        >
                            <img src={user.avatar_url || 'https://i.pravatar.cc/30'} alt={user.username} />
                            <span>{user.username}</span>
                        </Link>
                    ))}
                </div>
            )}

            {showResults && query && results.length === 0 && (
                <div className="search-results">
                    <div className="search-result-empty">No users found</div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
