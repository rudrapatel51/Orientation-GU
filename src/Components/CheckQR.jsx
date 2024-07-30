import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const CheckQR = () => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter text for QR code"
            />
            {inputValue && (
                <QRCode
                    id="qr-code"
                    value={inputValue}
                    size={256}
                    includeMargin={true}
                />
            )}
        </div>
    );
};

export default CheckQR;
