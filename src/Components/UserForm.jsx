import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios';

const UserForm = () => {
    const [uid, setUid] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [course, setCourse] = useState('');
    const [qrData, setQrData] = useState(null);
    const [error, setError] = useState('');
    const qrCodeRef = useRef(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format.');
            return;
        }

        // Mobile number validation
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobile)) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }

        const qrDataObject = { uid, name, mobile, email, course };
        setQrData(qrDataObject);

        // Send data to Google Sheets API
        try {
            await axios.post('https://sheetdb.io/api/v1/3y58wwz9jpmgy', {
                data: [qrDataObject]
            });
            setIsDisabled(true);  // Disable the button upon successful form submission
        } catch (error) {
            setError('Failed to send data to the server.');
            console.error(error);
        }
    };

    const downloadQRCode = () => {
        if (qrCodeRef.current) {
            const canvas = qrCodeRef.current.querySelector('canvas');
            if (canvas) {
                const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = `${uid}_QRCode.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } else {
                setError('QR code canvas not found.');
            }
        } else {
            setError('QR code reference not found.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center py-12 px-6">
            <div className="bg-white shadow-lg rounded-3xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <img src='./Gandhinagar University Logo - Final.png' alt="University Logo" className='h-16 mx-auto mb-4' />
                    <h1 className="text-3xl font-bold">Orientation</h1>
                    <br />
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            autoComplete="off"
                            id="name"
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                            required
                        />
                        <label
                            htmlFor="name"
                            className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                            Name (As Per SSC Marksheet)
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            autoComplete="off"
                            id="mobile"
                            name="mobile"
                            type="text"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="94286*****"
                            className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                            required
                        />
                        <label
                            htmlFor="mobile"
                            className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                            Mobile (At Time Of Register)
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            autoComplete="off"
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="mail@example.com"
                            className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                            required
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                            Email
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            autoComplete="off"
                            id="course"
                            name="course"
                            type="text"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            placeholder="Course"
                            className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
                            required
                        />
                        <label
                            htmlFor="course"
                            className="absolute left-0 -top-3.5 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                            Degree (Branch)
                        </label>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300" disabled={isDisabled}>
                        Submit
                    </button>
                </form>
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
                {qrData && (
                    <div ref={qrCodeRef} className="mt-4 text-center">
                        <QRCode value={JSON.stringify(qrData)} size={200} includeMargin={true} />
                        <button onClick={downloadQRCode} className="mt-2 bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
                            Download QR Code
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserForm;
