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
        <div className="login-container h-screen flex items-center justify-center">
            {isLoggedIn ? (
                <div>
                    <UserForm />
                    <button className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700' onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div className="login-container h-screen flex items-center justify-center">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <h2 className='text-2xl font-bold'>Login</h2>
                            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Username:</label>
                            <input
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Password:</label>
                            <input
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <br />
                        <button className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700' type="submit">Login</button>
                        {error && <p>{error}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default QrLogin;
