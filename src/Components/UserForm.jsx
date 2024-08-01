import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';

const UserForm = () => {
    const [uid, setUid] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [qrData, setQrData] = useState(null);
    const [error, setError] = useState('');
    const qrCodeRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format.');
            return;
        }

        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobile)) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }

        const qrDataObject = { uid, name, mobile, email };
        setQrData(qrDataObject);
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
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-semibold">User Information</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="relative">
                                    <input
                                        autoComplete="off"
                                        id="uid"
                                        name="uid"
                                        type="text"
                                        value={uid}
                                        onChange={(e) => setUid(e.target.value)}
                                        placeholder="UID"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        required
                                    />
                                    <label
                                        htmlFor="uid"
                                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                    >
                                        UID
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        autoComplete="off"
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        required
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                    >
                                        Name
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
                                        placeholder="Mobile"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        required
                                    />
                                    <label
                                        htmlFor="mobile"
                                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                    >
                                        Mobile
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
                                        placeholder="Email"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                                        required
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                    >
                                        Email
                                    </label>
                                </div>
                                <div className="relative">
                                    <button type="submit" className="bg-blue-500 text-black rounded-md px-2 py-1">Submit</button>
                                </div>
                            </div>
                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {qrData && (
                            <div ref={qrCodeRef} className="mt-4">
                                <QRCode value={JSON.stringify(qrData)} size={256} includeMargin={true} />
                                <button onClick={downloadQRCode} className="mt-2 bg-blue-500 text-black rounded-md px-2 py-1">Download QR Code</button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserForm;
