import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import axios from 'axios';

const QRCodeScanner = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', true);
                videoRef.current.addEventListener('loadedmetadata', () => {
                    videoRef.current.play();
                    requestAnimationFrame(scanQRCode);
                });
            } catch (error) {
                console.error('Error accessing camera: ', error);
                setStatus('Error accessing camera. Please ensure permissions are granted and you are using HTTPS.');
            }
        };

        const scanQRCode = () => {
            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                const code = jsQR(imageData.data, canvas.width, canvas.height);

                if (code) {
                    handleScan(code.data);
                } else {
                    requestAnimationFrame(scanQRCode);
                }
            }
        };

        const handleScan = async (data) => {
            try {
                const qrData = JSON.parse(data);

                if (qrData.uid && qrData.name && qrData.mobile && qrData.email) {
                    const response = await axios.get('https://sheetdb.io/api/v1/3y58wwz9jpmgy');
                    const sheetData = response.data;

                    const existingEntry = sheetData.find(entry => entry.mobile === qrData.mobile);

                    if (existingEntry) {
                        await axios.post('https://sheetdb.io/api/v1/3y58wwz9jpmgy', {
                            data: {
                                uid: existingEntry.uid,
                                name: existingEntry.name,
                                mobile: existingEntry.mobile,
                                email: existingEntry.email,
                                present: true
                            }
                        });
                        setStatus('Record updated successfully');
                    } else {
                        setStatus('Record not found');
                    }
                } else {
                    setStatus('Invalid QR code data format');
                }
            } catch (error) {
                console.error('Error processing QR code: ', error);
                setStatus('Error processing QR code');
            }
        };

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, []);

    return (
        <div>
            <video ref={videoRef} style={{ width: '100%' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <p>{status}</p>
        </div>
    );
};

export default QRCodeScanner;
