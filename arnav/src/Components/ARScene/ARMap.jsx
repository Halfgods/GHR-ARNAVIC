import React from 'react'
import { MapPin, MapPinCheckInside, SendHorizontal } from 'lucide-react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import blueprint from '../../Assets/blueprint.jpeg'
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';


const ARMap = ({ coords, setCoords, loading, setLoading, setData, apiData, imgUrl1 }) => {
    const imgRef = React.useRef(null);
    const [scale, setScale] = React.useState(1);
    const [aplha, setAplha] = React.useState(0);

    React.useEffect(() => {
        const handleOrientation = (e) => {
            setAplha(e.alpha);
        }
        window.addEventListener("deviceorientation", handleOrientation);

        return () => { window.removeEventListener("deviceorientation", handleOrientation) };
    }, [])


    const handleImgClick = (e) => {
        const rect = imgRef.current.getBoundingClientRect();

        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;


        setCoords((prev) => {
            if (!prev.src) {
                return { ...prev, src: { x, y } };
            } else if (!prev.dest) {
                return { ...prev, dest: { x, y } };
            } else {
                return { src: { x, y }, dest: null };
            }
        });
    };

    React.useEffect(() => {
        const rect = imgRef.current.getBoundingClientRect();
        setData((prev) => {
            return {
                ...prev,
                phone_width: Math.floor(rect.width),
                phone_height: Math.floor(rect.height),
                start: [Math.floor(coords?.src?.x), Math.floor(coords?.src?.y)],
                end: [Math.floor(coords?.dest?.x), Math.floor(coords?.dest?.y)]
            }
        })
    }, [coords])

    React.useEffect(() => {
        console.log(apiData);
    }, [apiData])


    //step detection
    const [currentPos, setCurrentPos] = React.useState(null);
    const [stepCount, setStepCount] = React.useState(0);
    const lastStepTime = React.useRef(0);

    React.useEffect(() => {
        const threshold = 13;   // sensitivity
        const delay = 400;      // ms between steps

        const handleMotion = (event) => {
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            const magnitude = Math.sqrt(
                acc.x * acc.x +
                acc.y * acc.y +
                acc.z * acc.z
            );

            const now = Date.now();

            if (magnitude > threshold && now - lastStepTime.current > delay) {
                lastStepTime.current = now;
                setStepCount(prev => prev + 1);
            }
        };

        window.addEventListener("devicemotion", handleMotion);
        return () => window.removeEventListener("devicemotion", handleMotion);
    }, []);

    React.useEffect(() => {
        if (!apiData?.turning_points?.length) return;
        if (!coords?.src) return;

        if (stepCount >= apiData.turning_points.length) return;

        const [x, y] = apiData.turning_points[stepCount];

        setCurrentPos({ x, y });

    }, [stepCount, apiData]);


    return (
        <>

            <TransformWrapper
                onTransformed={(state) => {
                    setScale(state.state.scale);
                }}
            >
                <TransformComponent>
                    <div className='mini-map' style={{ position: "relative" }}>
                        <div
                            className="map"
                            style={
                                apiData
                                    ? { transform: `rotate(${aplha - 55 || 0}deg)` }
                                    : {}
                            }
                        >
                            <img
                                src={apiData ? apiData.image_base64 : imgUrl1}
                                ref={imgRef}
                                alt="blueprint"
                                onClick={(e) => {
                                    if (!coords.src || !coords.dest) {
                                        handleImgClick(e);
                                    }
                                }}
                            />
                            {
                                loading &&
                                <div
                                    className="loaderwrapper"
                                    style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
                                >
                                    <CircularProgress color='white' size={52} />
                                </div>

                            }

                            {currentPos && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "absolute",
                                        top: currentPos.y,
                                        left: currentPos.x,
                                        transform: "translate(-50%, -50%)",
                                        width: 30,
                                        height: 30,
                                        background: "royalblue",
                                        borderRadius: "50%",
                                        transition: "0.2s linear"
                                    }}
                                >
                                    <SendHorizontal />
                                </div>
                            )}

                            {coords?.src && !currentPos && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "absolute",
                                        top: coords.src.y,
                                        left: coords.src.x,
                                        transform: "translate(-50%, -50%)",
                                        width: 30,
                                        height: 30,
                                        background: "royalblue",
                                        borderRadius: "50%"
                                    }}
                                ><MapPin /></div>
                            )}

                            {coords?.dest && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "absolute",
                                        transform: "translate(-50%, -50%)",
                                        top: coords.dest.y,
                                        left: coords.dest.x,
                                        width: 30,
                                        height: 30,
                                        background: "tomato",
                                        borderRadius: "50%"
                                    }}
                                ><MapPinCheckInside /></div>
                            )}

                        </div>
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </>
    )
}

export default ARMap