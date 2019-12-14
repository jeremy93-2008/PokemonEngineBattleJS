import React, { useState } from "react";
import { PkmnCircleProps, PkmnTrainerProps } from "./typing/pkmn-battle";

import "./style/pkmn-circle.css";
import { PokemonOneCircle } from "./pokemon-one-circle";
import Monster from "../core/monster";

export function PokemonCircle(props: PkmnCircleProps) {
    const {battle, message, trainers} = props;

    // Battle can be undefined when is running for the first time
    if(!battle || !message) return <div></div>;

    return (
        <div className="pokemon-circle">
            {[[battle.allyCurrentPokemon, battle.allyPokemonTeam, trainers.you], [battle.enemyCurrentPokemon, battle.enemyPokemonTeam, trainers.her]].map((getPkmnValue, index) => {
                const currentPkmn = getPkmnValue[0] as Monster;
                const team = getPkmnValue[1] as Monster[];
                const trainer = getPkmnValue[2] as PkmnTrainerProps;

                return <PokemonOneCircle key={currentPkmn.name
                +index} battle={battle} messageKey={message} human={index == 0} currentPkmn={currentPkmn} team={team} trainer={trainer}></PokemonOneCircle>
            })}
        </div>
    );
}