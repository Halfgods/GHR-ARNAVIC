import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from "react-router";
import '../../CSS/QrScan.css';

const QrScan = () => {
    const navigate = useNavigate()
    const html5QrCodeRef = useRef(null);
    const [result, setResult] = useState('Scanned result will appear here...');

    const stopScanner = async () => {
        if (html5QrCodeRef.current) {
            try {
                const state = html5QrCodeRef.current.getState();
                if (state === 2 || state === 3) {
                    await html5QrCodeRef.current.stop();
                }
            } catch (e) { }
            html5QrCodeRef.current = null;
        }
    };

    const startScanner = async () => {
        await stopScanner();

        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;

        Html5Qrcode.getCameras()
            .then(devices => {
                if (devices && devices.length) {
                    html5QrCode.start(
                        { facingMode: "environment" },
                        {
                            fps: 10,
                            qrbox: 250
                        },
                        (qrCodeMessage) => {
                            stopScanner();
                            setResult(qrCodeMessage);
                            navigate('/map', { state: qrCodeMessage })
                        },
                        (errorMessage) => { }
                    );
                }
            })
            .catch(err => {
                setResult("Camera access denied or not available.");
            });
    };

    useEffect(() => {
        startScanner();

        // Cleanup on unmount
        return () => {
            stopScanner();
        };
    }, []);

    return (
        <div className="qr-container">
            <h1 className='qr-h1'>Scan QR Code</h1>
            <p className='qr-p'>Point your camera at any QR code</p>

            <div id="reader"></div>

            <div className="result" id="result">
                <strong>Scanned:</strong><br />{result}
            </div>

            <button className='restart-qr' onClick={startScanner}>Restart Scanner</button>
        </div>
    );
};

export default QrScan;