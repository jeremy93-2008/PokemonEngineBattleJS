import React, { useState, useEffect } from "react";

import "./style/pkmn-battle.css";

import { PokemonCircle } from "./pkmn-circle";
import { RouteComponentProps } from "react-router-dom";
import { PkmnBattleProps, PkmnStateAnimation, PkmnMessage, PkmnStateMessage } from "./typing/pkmn-battle";
import { Battle } from "../core/battle";
import { nextMessage } from "./pkmn-message-core";

export function PokemonBattle(props: RouteComponentProps) {
    const { terrain, pkmns, trainers } = props as unknown as PkmnBattleProps;
    const [ally, setAlly] = useState({
        team: pkmns.you,
        trainer: {
            name: trainers.you.name,
            sprite: trainers.you.sprite
        }
    });
    const [enemy, setEnemy] = useState({
        team: pkmns.her,
        trainer: {
            name: trainers.her.name,
            sprite: trainers.her.sprite
        }
    });
    
    const [message, setMessage] = useState(<div></div>);

    useEffect(() => {
        setMessage(nextMessage(pkmns, trainers, setMessage));
    }, []);

    return (<div className={`background ${terrain}`}>
        <div className="messageWrapper">
            {message}
        </div>
    </div>);
}
