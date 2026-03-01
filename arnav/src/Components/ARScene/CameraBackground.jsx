import React from 'react'

const CameraBackground = () => {
    const videoRef = React.useRef(null)

    const handleCameraBackground = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false
            })
            videoRef.current.srcObject = stream
        } catch (err) {
            console.error("Camera error:", err)
        }
    }
    React.useEffect(() => { handleCameraBackground() }, [])

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
                width: "100%",
                height: "100vh",
                objectFit: "cover",
                opacity: 1
            }}
        />
    )
}

export default CameraBackground