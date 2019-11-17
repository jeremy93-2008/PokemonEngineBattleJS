import React from "react";
import { PkmnsAllTeams, setMessagePkmn, PkmnTrainers, PkmnBattleContainer, setBattlePkmn } from "./typing/pkmn-battle";
import { MessageStart, AttackForUser, MessagePokemonName } from "./pkmn-message";
import { Battle } from "../core/battle";
import clone from "lodash.clonedeep";

export let battle: Battle;

export const messagesList: JSX.Element[] = [];

export function nextMessage(pkmns: PkmnsAllTeams, trainers: PkmnTrainers, setMessage: setMessagePkmn, setBattle: setBattlePkmn) {
    if(!battle) initializeMessage(pkmns, trainers, setMessage)
    const next = messagesList.length > 1 ? messagesList.shift() : messagesList[0];
    return MessageContainer(next as JSX.Element, {pkmns, trainers, setMessage, setBattle});    
}

function MessageContainer(render: JSX.Element, nextArgs: PkmnBattleContainer) {
    const {pkmns, setMessage, trainers, setBattle} = nextArgs;
    const currentBattle = clone(battle);
    return (<div className="messageContainer" onClick={() => { 
        setMessage(nextMessage(pkmns, trainers, setMessage, setBattle));
        setBattle({battle: currentBattle, message: (render.key as string)})
        }}>
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
