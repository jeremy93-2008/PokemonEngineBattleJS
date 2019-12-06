import React, { useState, useEffect } from "react";
import clone from "lodash.clonedeep";
import { RouteComponentProps } from "react-router-dom";

import "./style/pkmn-battle.css";

import { PokemonCircle } from "./pkmn-circle";
import { PkmnBattleProps } from "./typing/pkmn-battle";
import { pkmnBattleKey } from "./pkmn-message-helper";
import { nextMessage, battle, messagesList, battlesList, currentMessageView } from "./pkmn-message-core";

export function PokemonBattle(props: RouteComponentProps) {
    const { terrain, pkmns, trainers } = props as unknown as PkmnBattleProps;
    
    const [message, setMessage] = useState(<div></div>);
    const [pkmnBattle, setPkmnBattle] = useState({battle, message: ""});

    useEffect(() => {
        setMessage(nextMessage(pkmns, trainers, setMessage, setPkmnBattle));
        setPkmnBattle({battle: clone(battle), message: pkmnBattleKey.MessageStart});
    }, []);

    return (<div className={`background ${terrain}`}>
        <div className="pokemonWrapper">
            {currentMessageView ? currentMessageView.key : ""}
            <PokemonCircle battle={pkmnBattle.battle} message={pkmnBattle.message}></PokemonCircle>
        </div>
        <div className="messageWrapper">
            {message}
        </div>
    </div>);
}
