import React, { useEffect, useRef, useState } from 'react';

const CheckQr = () => {
    const videoRef = useRef(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(true);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' } // 'environment' to access the back camera
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
            }
        };

        startCamera();

        // Clean up function to stop the video stream when component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div>
            <h1>this to check the back camera accesss</h1>
            {hasCameraPermission ? (
                <video ref={videoRef} width="100%" height="auto" />
            ) : (
                <p>Camera permission is not granted or an error occurred.</p>
            )}
        </div>
    );
};

export default CheckQr;
