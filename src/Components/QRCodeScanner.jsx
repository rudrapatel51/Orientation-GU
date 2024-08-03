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
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: 'environment' } }
                });

                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', true);
                videoRef.current.addEventListener('loadedmetadata', () => {
                    videoRef.current.play();
                    requestAnimationFrame(scanQRCode);
                });
            } catch (error) {
                console.error('Error accessing camera: ', error);
                setStatus('Error accessing camera. Ensure permissions are granted and you are using HTTPS.');
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

                if (qrData.name && qrData.mobile && qrData.email) {
                    const response = await axios.get('https://sheetdb.io/api/v1/1ggt8cj7ev4nm');
                    const sheetData = response.data;

                    const existingEntry = sheetData.find(entry => entry.mobile === qrData.mobile);

                    if (existingEntry) {
                        setStatus('Error: User already registered.');
                        alert("User Already Exists");
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        await axios.post('https://sheetdb.io/api/v1/1ggt8cj7ev4nm', {
                            data: {
                                name: qrData.name,
                                mobile: qrData.mobile,
                                email: qrData.email,
                                course: qrData.course || "",
                                present: true,
                            }
                        });
                        setStatus('Record added successfully');
                        alert("User added successfully");
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
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
            <h1 className='text-3xl font-bold text-center'>This camera is to submit the record</h1>
            <video ref={videoRef} style={{ width: '100%' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <p>{status}</p>
        </div>
    );
};

export default QRCodeScanner;
