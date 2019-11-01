import React from "react";
import { PkmnsAllTeams, PkmnTrainers, setMessagePkmn } from "./typing/pkmn-battle";
import { battle } from "./pkmn-message-core";
import { onClickAttackForUser } from "./pkmn-message-helper";

export function MessageStart() {
    const enemyName = battle.trainers.her.name;
    if(!enemyName) return <div>¡Un pokemon salvaje ha aparecido!</div>
    return (<div>¡{enemyName} te lanza un desafio!</div>);
}

export function AttackForUser() {
    const pkmn = battle.allyCurrentPokemon
    return <div className="attacks-container">
        {pkmn.attacks.map((att, index) => 
            <button onClick={() => {onClickAttackForUser(att)}} className={`attack-button ${att.typing.toLowerCase()}`}>
                <span className="name">{att.name}</span>
                <span className="type">{att.typing.toLowerCase()}</span>
            </button>)}
    </div>;
}

export function AttackLaunchedMessage() {
    const isEnemy = battle.currentPokemonTurn.name === battle.enemyCurrentPokemon.name;
    return (<div>¡{battle.currentPokemonTurn.name} {isEnemy ? "enemigo" : ""} ha usado {battle.attackLaunched.name}!</div>);
}

export function UnableAttackMessage() {
    const isEnemy = battle.currentPokemonTurn.name === battle.enemyCurrentPokemon.name;
    return (<div>¡{battle.currentPokemonTurn.name} {isEnemy ? "enemigo" : ""} está {battle.currentPokemonTurn.currentStatus.effect}!</div>);
}

export function DamageAttackMessage() {
    const isEnemyReceptor = battle.enemyCurrentPokemon.name === battle.currentEnemyPokemonTurn.name;
    return (<div>{battle.currentEnemyPokemonTurn.name} {isEnemyReceptor ? "enemigo" : ""} ha recibido {battle.currentAttackDamageTurn} PV</div>);
}

export function FaintedMessage() {
    const isEnemyReceptor = battle.enemyCurrentPokemon.name === battle.enemyCurrentPokemon.name;
    return (<div>{battle.currentEnemyPokemonTurn.name} {isEnemyReceptor ? "enemigo" : ""} está debilitado</div>);
}