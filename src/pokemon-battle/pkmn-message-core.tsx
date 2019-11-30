import React from "react";
import { PkmnsAllTeams, setMessagePkmn, PkmnTrainers, PkmnBattleContainer, setBattlePkmn, pkmnBattleList } from "./typing/pkmn-battle";
import { MessageStart, AttackForUser, MessagePokemonName } from "./pkmn-message";
import { Battle } from "../core/battle";
import clone from "lodash.clonedeep";
import { pkmnBattleKey } from "./pkmn-message-helper";

export let battle: Battle;
export let circleBattle: Battle;

export const messagesList: JSX.Element[] = [];
export const battlesList: pkmnBattleList[] = [];
export let currentBattleView: Battle;

export function nextMessage(pkmns: PkmnsAllTeams, trainers: PkmnTrainers, setMessage: setMessagePkmn, setBattle: setBattlePkmn) {
    if(!battle) initializeMessage(pkmns, trainers, setMessage)
    const next = messagesList.length > 1 ? messagesList.shift() : messagesList[0];
    return MessageContainer(next as JSX.Element, {pkmns, trainers, setMessage, setBattle});    
}

function MessageContainer(render: JSX.Element, nextArgs: PkmnBattleContainer) {
    const {pkmns, setMessage, trainers, setBattle} = nextArgs;
    const pkmnBattle = clone(battle);
    return (<div className="messageContainer" onClick={() => { 
        setMessage(nextMessage(pkmns, trainers, setMessage, setBattle));
        const nextMessageKey = messagesList[0].key;
        setBattle({battle: getCurrentBattleFromKey(nextMessageKey as string), 
            message: nextMessageKey as string})
        }}>
        {render}
    </div>);
}

function initializeMessage(pkmns: PkmnsAllTeams, trainers: PkmnTrainers, setMessage: setMessagePkmn) {
    battle = new Battle(pkmns.you, pkmns.her, trainers);
    currentBattleView = clone(battle);
    circleBattle = battle;
    messagesList.push(MessageStart());
    messagesList.push(MessagePokemonName(battle.trainers.you, 
        battle.allyCurrentPokemon))
    messagesList.push(MessagePokemonName(battle.trainers.her, 
        battle.enemyCurrentPokemon))
    messagesList.push(AttackForUser())
}

function getCurrentBattleFromKey(key: string) {
    if (battlesList[0] && battlesList[0].key == key) {
        currentBattleView = battlesList.shift()!.battle;
    }
    return currentBattleView;
}
