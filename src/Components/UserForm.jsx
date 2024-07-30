import React, { useState, useRef } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const UserForm = () => {
    const [uid, setUid] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [qrData, setQrData] = useState(null);
    const [error, setError] = useState('');
    const qrCodeRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Qr is sent in this data
        const qrDataObject = { uid, name, mobile, email };
        setQrData(qrDataObject);

        try {
            const apiUrl = 'https://sheetdb.io/api/v1/3y58wwz9jpmgy';
            const response = await axios.post(apiUrl, {
                uid,
                name,
                mobile,
                email,
            });

            console.log(response.data);

            if (response.status === 200 && response.data && response.data.created) {
                const createdData = response.data.created[0];
                if (createdData && createdData.id) {
                    const uniqueId = createdData.id;
                    setQrData({ ...qrDataObject, uniqueId });
                } else {
                    setError('Response data is missing expected fields.');
                }
            }
        } catch (err) {
            console.error(err);
            setError(`Error occurred: ${err.response ? err.response.data : err.message}`);
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
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="UID" value={uid} onChange={(e) => setUid(e.target.value)} required />
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Submit</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {qrData && (
                <div ref={qrCodeRef}>
                    <QRCode
                        value={JSON.stringify(qrData)}
                        size={256}
                        includeMargin={true}
                    />
                    <button onClick={downloadQRCode}>Download QR Code</button>
                </div>
            )}
        </div>
    );
};

export default UserForm;
