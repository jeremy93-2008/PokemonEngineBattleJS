import React from "react";
import { PkmnCircleProps } from "./typing/pkmn-battle";
import images from "../assets/normal/*.png";
import back_images from "../assets/back/*.png";

import "./style/pkmn-circle.css";

export function PokemonCircle(props: PkmnCircleProps) {
    console.log(props);
    return (
        <div className="pokemon-circle">
            <div className="hud"></div>
            <div className={`pokemon ${props.humain ? "human" : ""}`}><img src={(props.humain) ? back_images[props.pkmns[0].name] : images[props.pkmns[0].name]}></img></div>
            <div className={`circle ${props.humain ? "human" : ""}`}></div>
        </div>
    );
}