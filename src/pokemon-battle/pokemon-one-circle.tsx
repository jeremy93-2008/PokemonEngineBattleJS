import React, { useState } from "react";
import { PkmnCircleOneProps } from "./typing/pkmn-battle";
import images from "../assets/normal/*.png";
import back_images from "../assets/back/*.png";
import pokeball from "../assets/pokeball.png";

import "./style/pkmn-circle.css";

export function PokemonOneCircle(props: PkmnCircleOneProps) {
    const { team, currentPkmn, human } = props;
    // Team and currentPkmn can be undefined when is running for the first time
    if(!team || !currentPkmn) return <div></div>;

    return (
        <>
            <div className={`hud ${human ? " human" : ""}`}>
                <div className="pokeball-list">
                    {team.map(() => <img className="pokeball" src={pokeball} />)}
                </div>
            </div>
            
            <img className={`pokemon ${human ? " human" : ""}`} src={human ? back_images[currentPkmn.name] : images[currentPkmn.name]} />
        </>
    );
}