import React, { useState } from "react";
import { PkmnCircleOneProps } from "./typing/pkmn-battle";
import images from "../assets/normal/*.png";
import back_images from "../assets/back/*.png";
import pokeball from "../assets/pokeball.png";

import "./style/pkmn-circle.css";

export function PokemonOneCircle(props: PkmnCircleOneProps) {
    const { team, currentPkmn, human } = props;
    const percentageHp = (currentPkmn.stats.hp * 100 / currentPkmn.maxHP);
    // Team and currentPkmn can be undefined when is running for the first time
    if(!team || !currentPkmn) return <div></div>;

    return (
        <>
            <div className={`hud ${human ? " human" : ""}`}>
                <div className="pokeball-list">
                    {team.map(() => <img className="pokeball" src={pokeball} />)}
                </div>
                <div className="name">{currentPkmn.name} {currentPkmn.currentStatus.effect}</div><div className="level">Lv {currentPkmn.level}</div> 
                <div className={`hp-name ${human ? "humain" : ""}`}>{human ? "HP" : ""}
                    <div className={`hp-container ${human ? "human" : ""}`}>
                        <div style={{width: percentageHp +"%", 
                        background: `${percentageHp < 20 ? "red": percentageHp < 40 ? "orange" : "green"}`}} 
                        className="current-hp"></div>
                    </div>
                </div>
                {human && <div className="hp-number">{(currentPkmn.stats.hp).toFixed(0)}/{currentPkmn.maxHP}</div>}
            </div>
            
            <img className={`pokemon ${human ? " human" : ""}`} src={human ? back_images[currentPkmn.name] : images[currentPkmn.name]} />
        </>
    );
}