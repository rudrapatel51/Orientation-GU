import React, { useState, useEffect } from 'react';
import UserForm from '../Components/UserForm';

const QrLogin = () => {
    const validUsername = 'rudra';
    const validPassword = 'rudra@123';
    const tokenKey = 'heyydontseeme';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem(tokenKey);
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (username === validUsername && password === validPassword) {
            localStorage.setItem(tokenKey, 'some-token-value');
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Invalid username or password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(tokenKey);
        setIsLoggedIn(false);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {isLoggedIn ? (
                <div>
                    <UserForm />
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    {error && <p>{error}</p>}
                </form>
            )}
        </div>
    );
};

export default QrLogin;
