import React from "react";
import { PkmnsAllTeams, setMessagePkmn, PkmnTrainerProps } from "./typing/pkmn-battle";
import { battle } from "./pkmn-message-core";
import { onClickAttackForUser, onClickPokemonChooseForUser, onClickPokemonCanBeChangedForUser, onClickPokemonContinueWithoutChanging, pkmnBattleKey } from "./pkmn-message-helper";
import { PokemonList } from "./pkmn-list";
import Monster from "../core/monster";

export function MessageStart() {
    const enemyName = battle.trainers.her.name;
    if(!enemyName) return <div>¡Un pokemon salvaje ha aparecido!</div>
    return (<div key={pkmnBattleKey.MessageStart}>¡{enemyName} te lanza un desafio!</div>);
}

export function MessagePokemonName(trainer: PkmnTrainerProps,pkmn: Monster, key?: string) {
    return (<div key={key ? key : pkmnBattleKey.MessagePokemonName}>¡{trainer.name} envía a {pkmn.name}!</div>);
}

export function AttackForUser() {
    const pkmn = battle.allyCurrentPokemon
    return <div key={pkmnBattleKey.AttackForUser} className="attacks-container">
        {pkmn.attacks.map((att, index) => 
            <button onClick={() => {onClickAttackForUser(att)}} className={`attack-button ${att.typing.toLowerCase()}`}>
                <span className="name">{att.name}</span>
                <span className="type">{att.typing.toLowerCase()}</span>
            </button>)}
    </div>;
}

export function PokemonChooseForUser() {
    const teamPkmn = battle.allyPokemonTeam;
    return <PokemonList key={pkmnBattleKey.PokemonChooseForUser} onClick={(pkmn, index) => {
        onClickPokemonChooseForUser(index);
    }} pkmns={teamPkmn} disabled={teamPkmn.filter(pkmn => pkmn.stats.hp == 0).map(pkmn => pkmn.toPokemon())} details={{hp: true}}></PokemonList>
}

export function PokemonCanBeChangedForUser() {
    return (<div key={pkmnBattleKey.PokemonCanBeChangedForUser} className="changed-pokemon">
        <p>¿Quieres cambiar de pokémon?</p>
        {["Si","No"].map((text, index) => <button onClick={index == 0 ? onClickPokemonCanBeChangedForUser : onClickPokemonContinueWithoutChanging} className="btn">{text}</button>)}
    </div>);
}

export function AttackLaunchedMessage() {
    const isEnemy = battle.currentPokemonTurn.name === battle.enemyCurrentPokemon.name;
    return (<div key={pkmnBattleKey.AttackLaunchedMessage}>¡{battle.currentPokemonTurn.name} {isEnemy ? "enemigo" : ""} ha usado {battle.attackLaunched.name}!</div>);
}

export function UnableAttackMessage() {
    const isEnemy = battle.currentPokemonTurn.name === battle.enemyCurrentPokemon.name;
    return (<div key={pkmnBattleKey.UnableAttackMessage}>¡{battle.currentPokemonTurn.name} {isEnemy ? "enemigo" : ""} está {battle.currentPokemonTurn.currentStatus.effect}!</div>);
}

export function DamageAttackMessage() {
    const isEnemyReceptor = battle.enemyCurrentPokemon.name === battle.currentEnemyPokemonTurn.name;
    return (<div key={pkmnBattleKey.DamageAttackMessage}>{battle.currentEnemyPokemonTurn.name} {isEnemyReceptor ? "enemigo" : ""} ha recibido {battle.currentAttackDamageTurn} PV</div>);
}

export function FaintedMessage() {
    const isEnemyReceptor = battle.enemyCurrentPokemon.name === battle.currentEnemyPokemonTurn.name;
    return (<div key={pkmnBattleKey.FaintedMessage}>{battle.currentEnemyPokemonTurn.name} {isEnemyReceptor ? "enemigo" : ""} está debilitado</div>);
}

export function EvadedAttackMessage() {
    const isEnemyReceptor = battle.enemyCurrentPokemon.name === battle.currentEnemyPokemonTurn.name;
    return (<div key={pkmnBattleKey.EvadedAttackMessage}>{battle.currentEnemyPokemonTurn.name} {isEnemyReceptor ? "enemigo" : ""} ha esquivado el ataque</div>);    
}