import React, { useEffect, useRef } from "react"
import "./Canvas.css"

const Canvas = props => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 40, 0, 2 * Math.PI);
        ctx.fill();
    }, [])

    return <canvas ref={canvasRef} {...props} />
}

export default Canvas