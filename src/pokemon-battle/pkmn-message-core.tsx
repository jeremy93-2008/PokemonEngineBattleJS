import React from "react";
import { PkmnsAllTeams, setMessagePkmn, PkmnTrainers, PkmnBattleContainer } from "./typing/pkmn-battle";
import { MessageStart, AttackForUser, MessagePokemonName } from "./pkmn-message";
import { Battle } from "../core/battle";

export let battle: Battle;

export const messagesList: JSX.Element[] = [];

export function nextMessage(pkmns: PkmnsAllTeams, trainers: PkmnTrainers, setMessage: setMessagePkmn) {
    if(!battle) initializeMessage(pkmns, trainers, setMessage)
    const next = messagesList.length > 1 ? messagesList.shift() : messagesList[0];
    return MessageContainer(next as JSX.Element, {pkmns, trainers, setMessage});    
}

function MessageContainer(render: JSX.Element, nextArgs: PkmnBattleContainer) {
    const {pkmns, setMessage, trainers} = nextArgs;
    return (<div className="messageContainer" onClick={() => { setMessage(nextMessage(pkmns, trainers, setMessage))}}>
        {render}
    </div>);
}

function initializeMessage(pkmns: PkmnsAllTeams, trainers: PkmnTrainers, setMessage: setMessagePkmn) {
    battle = new Battle(pkmns.you, pkmns.her, trainers);
    messagesList.push(MessageStart());
    messagesList.push(MessagePokemonName(battle.trainers.you, 
        battle.allyCurrentPokemon))
    messagesList.push(MessagePokemonName(battle.trainers.her, 
        battle.enemyCurrentPokemon))
    messagesList.push(AttackForUser())
}
