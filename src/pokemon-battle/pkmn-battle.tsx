import React, { useState } from "react";

import "./style/pkmn-battle.css";

import Monster from "../core/monster";
import { PokemonCircle } from "./pkmn-circle";
import { RouteComponentProps } from "react-router-dom";
import { PkmnBattleTerrain, PkmnBattleProps } from "./typing/pkmn-battle";

export function PokemonBattle(props: RouteComponentProps) {
    const { terrain, pkmns, trainers } = props.location.state as PkmnBattleProps;
    const [ally, setAlly] = useState({});
    const [enemy, setEnemy] = useState({});

    return (<div className="background"
        style={{background: getGradientFromTerrain(terrain)}}>
            <PokemonCircle humain={false} terrain={terrain} pkmns={pkmns.her} trainer={trainers.her}></PokemonCircle>
            <PokemonCircle humain={true} terrain={terrain} pkmns={pkmns.you} trainer={trainers.you}></PokemonCircle>
    </div>);
}

function getGradientFromTerrain(terrain: PkmnBattleTerrain) {
    switch(terrain) {
        case "grass" : 
            return linearGradient("#9de59d","#60e360","#43c943","#37a137","#43c943","#60e360","#9de59d");
        case "ocean":
            return linearGradient("#82b3d7","#6386c0","#3871a3","#21516d","#3871a3","#6386c0","#82b3d7");
        case "mountain":
            return linearGradient("#eec499","#db832b","#b4691f","#844e17","#b4691f","#db832b","#eec499");
    };
}

function linearGradient(...colors: string[]) {
    return `repeating-linear-gradient(${colors.join(",")} 40.3%)`;
}
