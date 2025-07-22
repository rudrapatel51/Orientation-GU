import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = () => {
    const url = 'https://orientation-gu.vercel.app/';

    const [scan, setScan] = useState("")

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Scan the QR Code</h2>
            <input type='text' onChange={(e) => setScan(e.target.value)} />
            <QRCode value={scan} size={200} />
            <p>Visit: {url}</p>
        </div>
    );
};

export default QRCodeGenerator;
