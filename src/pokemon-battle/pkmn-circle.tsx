import React, { useState } from "react";
import { PkmnCircleProps } from "./typing/pkmn-battle";
import images from "../assets/normal/*.png";
import back_images from "../assets/back/*.png";
import pokeball from "../assets/pokeball.png";

import "./style/pkmn-circle.css";
import { PokemonOneCircle } from "./pokemon-one-circle";
import Monster from "../core/monster";

export function PokemonCircle(props: PkmnCircleProps) {
    const {battle, message} = props;

    // Battle can be undefined when is running for the first time
    if(!battle || !message) return <div></div>;

    return (
        <div className="pokemon-circle">
            {[[battle.allyCurrentPokemon, battle.allyPokemonTeam], [battle.enemyCurrentPokemon, battle.enemyPokemonTeam]].map((getPkmnValue, index) => {
                const currentPkmn = getPkmnValue[0] as Monster;
                const team = getPkmnValue[1] as Monster[];

                return <PokemonOneCircle key={currentPkmn.name
                +index} human={index == 0} currentPkmn={currentPkmn} team={team}></PokemonOneCircle>
            })}
        </div>
    );
}