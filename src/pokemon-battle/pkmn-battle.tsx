import React, { useState, useEffect } from "react";

import "./style/pkmn-battle.css";

import { PokemonCircle } from "./pkmn-circle";
import { RouteComponentProps } from "react-router-dom";
import { PkmnBattleProps, PkmnStateAnimation, PkmnMessage, PkmnStateMessage } from "./typing/pkmn-battle";
import { Battle } from "../core/battle";
import { reducerMessage } from "./pkmn-message";

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

    const [battle] = useState(new Battle(ally.team, enemy.team));

    const [message, setMessage] = useState<PkmnMessage>({render: <div key={-1}></div>, state: undefined, action: "MessageStart"});
    const [animation, setAnimation] = useState<PkmnStateAnimation>();

    useEffect(() => {
        if (message.render.key == -1) setMessage(reducerMessage("MessageStart", {ally, battle, enemy, setMessage, setAnimation}));
    }, [message]);

    return (<div className={`background ${terrain}`}>
        <PokemonCircle action={message.action} animation={(animation && !!!animation.human) ? animation : undefined} 
            {...enemy} isHumanTurn={message.state ? message.state.human || true : true} pokemonSelected={battle.enemyPkmnIndex} humain={false} 
            beginBattle={message.state ? message.state.beginBattle || false : false} terrain={terrain}></PokemonCircle>
        <PokemonCircle action={message.action} animation={(animation && !!animation.human) ? animation : undefined} 
            {...ally} isHumanTurn={message.state ? message.state.human || true : true} pokemonSelected={battle.allyPkmnIndex} humain={true} 
            beginBattle={message.state ? message.state.beginBattle || false : false} terrain={terrain}></PokemonCircle>
        <div className="messageContainer">
            {message.render}
        </div>
    </div>);
}
