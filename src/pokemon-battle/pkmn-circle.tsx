import React, { useState } from "react";
import { PkmnCircleProps, PkmnStateAnimation } from "./typing/pkmn-battle";
import images from "../assets/normal/*.png";
import back_images from "../assets/back/*.png";
import pokeball from "../assets/pokeball.png";

import "./style/pkmn-circle.css";
import { AnimationAttack } from "./compositor/animation";

export function PokemonCircle(props: PkmnCircleProps) {

    const pokemon = props.team[props.pokemonSelected];
    const animation = props.animation;
    const percentageHp = (pokemon.stats.hp * 100 / pokemon.maxHP);

    return (
        <div className="pokemon-circle">
            <div className={`hud ${props.humain ? "human" : ""}`}>
                <div className="pokeball-list">
                    {props.team.map((pkmn) => <img className={`pokeball ${pkmn.stats.hp <= 0 ? "disable" : ""}`} src={pokeball}></img>)}
                </div>
                <div className="name">{pokemon.name} {pokemon.currentStatus.effect}</div><div className="level">Lv {pokemon.level}</div> 
                <div className={`hp-name ${props.humain ? "humain" : ""}`}>{props.humain ? "HP" : ""}
                    <div className={`hp-container ${props.humain ? "human" : ""}`}>
                        <div style={{width: percentageHp +"%", 
                        background: `${percentageHp < 20 ? "red": percentageHp < 40 ? "orange" : "green"}`}} 
                        className="current-hp"></div>
                    </div>
                </div>
                {props.humain && <div className="hp-number">{(pokemon.stats.hp).toFixed(0)}/{pokemon.maxHP}</div>}
            </div>
            {doAnimation(animation as PkmnStateAnimation)}
            {props.trainer.sprite && <div className={getTrainerClassName(props)}><img src={props.trainer.sprite}></img></div>}
            <div className={getPkmnClassName(props)}><img src={(props.humain) ? back_images[pokemon.name] : images[pokemon.name]}></img></div>
        </div>
    );
}