import React, { useEffect, useRef } from "react";
import { X } from 'lucide-react'
import "pannellum/build/pannellum.css";
import "pannellum/build/pannellum.js";
import panorama from '../../Assets/ghr.jpeg'
const Pannellum = ({ setIsARScence }) => {
    const viewerRef = useRef(null);

    useEffect(() => {
        pannellum.viewer(viewerRef.current, {
            type: "equirectangular",
            panorama: panorama,
            autoLoad: true,
            showZoomCtrl: true,
            "haov": 360,
            "vaov": 80,
            "vOffset": 2,
            orientationOnByDefault: true,
            title: "GH Raisoni",
            author: "Team Vibeyz"
        });
    }, []);

    return (
        <>
            <button type="button" className="view-360-btn" onClick={() => { setIsARScence(true) }}><X /></button>
            <div
                ref={viewerRef}
                style={{ width: "100%", height: "100vh" }}
            />
        </>

    );
};

export default Pannellum