import React, { useState, useEffect } from "react";

import "./style/pkmn-battle.css";

import { PokemonCircle } from "./pkmn-circle";
import { RouteComponentProps } from "react-router-dom";
import { PkmnBattleProps, PkmnStateAnimation } from "./typing/pkmn-battle";
import { Battle } from "../core/battle";
import { reducerMessage } from "./pkmn-message";

export function PokemonBattle(props: RouteComponentProps) {
    const { terrain, pkmns } = props.location.state as PkmnBattleProps;
    const [ally, setAlly] = useState({
        pokemonSelected: 0,
        team: pkmns.you,
        trainer: ""
    });
    const [enemy, setEnemy] = useState({
        pokemonSelected: 0,
        team: pkmns.her,
        trainer: ""
    });

    const [battle] = useState(new Battle(ally.team, enemy.team));

    const [message, setMessage] = useState<JSX.Element>(<div key={-1}></div>);
    const [animation, setAnimation] = useState<PkmnStateAnimation>();

    useEffect(() => {
        if (message.key == -1) setMessage(reducerMessage("Attack", {ally, battle, enemy, setMessage, setAnimation}));
    }, [message]);

    return (<div className={`background ${terrain}`}>
        <PokemonCircle animation={(animation && !!!animation.human) ? animation : undefined} 
            {...enemy} humain={false} terrain={terrain}></PokemonCircle>
        <PokemonCircle animation={(animation && !!animation.human) ? animation : undefined} 
            {...ally} humain={true} terrain={terrain}></PokemonCircle>
        <div className="messageContainer">
            {message}
        </div>
    </div>);
}
