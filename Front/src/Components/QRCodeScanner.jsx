import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

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

        const parseQRData = (data) => {
            const lines = data.split('\n');
            const parsed = {};
            
            lines.forEach(line => {
                const [key, value] = line.split(': ').map(item => item.trim());
                if (key && value) {
                    parsed[key.toLowerCase()] = value;
                }
            });
            
            return parsed;
        };

        const handleScan = async (data) => {
            try {
                const qrData = parseQRData(data);
                console.log('Parsed QR Data:', qrData);

                const formattedData = {
                    "id": parseInt(qrData.id) || Date.now(), 
                    "Guest Name": qrData.name || qrData['guest name'],
                    "Guest Contact": qrData.contact || qrData['guest contact'],
                    "Aadhaar Details": qrData.aadhaar || qrData['aadhaar details'],
                    "Reference Enrollment Number": qrData['enrollment number'] || qrData['reference enrollment number']
                };

                const response = await fetch(`${import.meta.env.VITE_API_URL}/add_outsider_data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formattedData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setStatus('Guest data added successfully');
                alert("Guest data added successfully");
                
                // Reload after successful submission
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            } catch (error) {
                console.error('Error processing QR code: ', error);
                setStatus(`Error: ${error.message || 'Failed to process QR code'}`);
                alert(error.message || "Error processing QR code. Please try again.");
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
            <h1 className='text-3xl font-bold text-center'>Scan Guest QR Code</h1>
            <div className="my-4 text-center text-sm text-gray-600">
                Please scan the guest's QR code to record their details
            </div>
            <video ref={videoRef} style={{ width: '100%' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <p className="mt-4 text-center text-sm font-semibold">{status}</p>
        </div>
    );
};

export default QRCodeScanner;