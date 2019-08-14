import React, { useEffect, useState } from "react";

let sCount = 0;

export function AnimationAttack(props: AnimationProps) {
    const { count, image, splitBy, time, className } = props;
    const [position, setPosition] = useState<AnimationPosition>({ x: 0, y: 0 });
    const [animationEnd, setAnimationEnd] = useState(false);

    const imageRender = new Image();
    imageRender.src = image;
    
    const widthRenderer = imageRender.width / splitBy;

    setTimeout(() => {
        if(animationEnd) return;

        if (sCount >= count && !animationEnd) {
            setAnimationEnd(true);
            sCount = 0;
            return;
        } else {
            setPosition(calculatePosition(position, splitBy, imageRender));
            sCount = sCount + 1;
        }
    }, (time) / count);

    return (<div className={className} style={{ position: "absolute",
        backgroundImage: `url(${image})`, backgroundPositionX: position.x, backgroundPositionY: position.y,
        width: widthRenderer + "px", height: widthRenderer + "px", display: (animationEnd) ? "none" : "inline-block"
    }}></div>);
}

function calculatePosition(position: AnimationPosition, splitBy: number, image: HTMLImageElement) {
    const widthRenderer = image.width / splitBy;
    let x = 0;
    let y = 0;
    if (position.x < image.width) {
        x = position.x + widthRenderer
    } else if (position.y < image.height) {
        y = position.y + widthRenderer;
    }
    return { x, y }
}