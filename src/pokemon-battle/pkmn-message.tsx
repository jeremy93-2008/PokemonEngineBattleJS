import React from "react";
import { PkmnsAllTeams, setMessagePkmn, PkmnTrainerProps } from "./typing/pkmn-battle";
import { battle } from "./pkmn-message-core";
import { onClickAttackForUser, onClickPokemonChooseForUser } from "./pkmn-message-helper";
import { PokemonList } from "./pkmn-list";
import Monster from "../core/monster";

export function MessageStart() {
    const enemyName = battle.trainers.her.name;
    if(!enemyName) return <div>¡Un pokemon salvaje ha aparecido!</div>
    return (<div>¡{enemyName} te lanza un desafio!</div>);
}

export function MessagePokemonName(trainer: PkmnTrainerProps,pkmn: Monster) {
    return (<div>¡{trainer.name} envía a {pkmn.name}!</div>);
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

export function PokemonChooseForUser() {
    const teamPkmn = battle.allyPokemonTeam;
    return <PokemonList onClick={(pkmn, index) => {
        onClickPokemonChooseForUser(index);
    }} pkmns={teamPkmn} details={{hp: true}}></PokemonList>
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
    const isEnemyReceptor = battle.enemyCurrentPokemon.name === battle.currentEnemyPokemonTurn.name;
    return (<div>{battle.currentEnemyPokemonTurn.name} {isEnemyReceptor ? "enemigo" : ""} está debilitado</div>);
}

export function EvadedAttackMessage() {
    const isEnemyReceptor = battle.enemyCurrentPokemon.name === battle.currentEnemyPokemonTurn.name;
    return (<div>{battle.currentEnemyPokemonTurn.name} {isEnemyReceptor ? "enemigo" : ""} ha esquivado el ataque</div>);    
}