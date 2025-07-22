import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CheckQR = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uuid = params.get('uuid');
    if (!uuid) {
      setStatus('error');
      setMessage('No UUID found in the QR code.');
      return;
    }
    axios.post(`${import.meta.env.VITE_API_URL}/student/scan`, { uuid })
      .then(res => {
        if (res.data.success) {
          setStatus('success');
          setMessage('Attendance marked successfully!');
        } else {
          setStatus('error');
          setMessage(res.data.message || 'Failed to mark attendance.');
        }
      })
      .catch(err => {
        setStatus('error');
        setMessage('Error connecting to server or marking attendance.');
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === 'loading' && <p>Checking attendance...</p>}
      {status === 'success' && <p className="text-green-600 text-xl font-bold">{message}</p>}
      {status === 'error' && <p className="text-red-600 text-xl font-bold">{message}</p>}
    </div>
  );
};

export default CheckQR;
