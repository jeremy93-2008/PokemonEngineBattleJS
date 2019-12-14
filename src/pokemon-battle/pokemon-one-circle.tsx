import React, { useState } from "react";
import { PkmnCircleOneProps } from "./typing/pkmn-battle";
import images from "../assets/normal/*.png";
import back_images from "../assets/back/*.png";
import pokeball from "../assets/pokeball.png";

import "./style/pkmn-circle.css";
import { pkmnBattleKey } from "./pkmn-message-helper";
import Monster from "../core/monster";
import { Battle } from "../core/battle";

export function PokemonOneCircle(props: PkmnCircleOneProps) {
    const { team, currentPkmn, human, messageKey, battle, trainer } = props;
    const percentageHp = (currentPkmn.stats.hp * 100 / currentPkmn.maxHP);
    // Team and currentPkmn can be undefined when is running for the first time
    if(!team || !currentPkmn) return <div></div>;

    return (
        <>
            <div className={`hud ${human ? " human" : ""}`}>
                <div className="pokeball-list">
                    {team.map((pkmn) => <img className={"pokeball" + (pkmn.stats.hp == 0 ? " disable" : "")} src={pokeball} />)}
                </div>
                <div className="name">{currentPkmn.name} {currentPkmn.currentStatus.effect}</div><div className="level">Lv {currentPkmn.level}</div> 
                <div className={`hp-name ${human ? "humain" : ""}`}>{human ? "HP" : ""}
                    <div className={`hp-container ${human ? "human" : ""}`}>
                        <div style={{width: percentageHp +"%", 
                        background: `${percentageHp < 20 ? "red": percentageHp < 40 ? "orange" : "green"}`}} 
                        className="current-hp"></div>
                    </div>
                </div>
                {human && <div className="hp-number">{(currentPkmn.stats.hp).toFixed(0)}/{currentPkmn.maxHP}</div>}
            </div>
            
            <img className={`pokemon ${human ? " human" : ""} ${getClassNameForPokemon(messageKey, currentPkmn, battle)}`} src={human ? back_images[currentPkmn.name] : images[currentPkmn.name]} />
            <img className={`trainer ${human ? " human" : ""} ${getClassNameForTrainers(messageKey)}`} src={trainer.sprite}></img>
        </>
    );
}
function getClassNameForTrainers(key: string) {
    if(key == pkmnBattleKey.MessagePokemonNameNewChallenger.BeginBattle) return "endAnimationTrainer"
    return (key == pkmnBattleKey.MessageStart) ? "" : "invisible";
}
function getClassNameForPokemon(key: string, currentPkmn: Monster, battle: Battle) {
    let classes = "";
    if(key == pkmnBattleKey.MessageStart) {
        classes = "invisible"
    }
    if(key == pkmnBattleKey.AttackLaunchedMessage && currentPkmn.id == battle.currentEnemyPokemonTurn.id && !battle.currentAttackResult!.attackEvaded) {
        classes = "damaged"
    }
    if(isBatteBegin(key) || isNewPkmnChallenger(key, currentPkmn, battle) || isEnemyPokemonFainted(key, currentPkmn, battle)) {
        classes = "startAnimation";
    }
    return classes;
}

function isBatteBegin(key: string) {
    return key == pkmnBattleKey.MessagePokemonNameNewChallenger.BeginBattle;
}

function isNewPkmnChallenger(key: string, currentPkmn: Monster, battle: Battle) {
    return (key == pkmnBattleKey.MessagePokemonNameNewChallenger.Ally && currentPkmn.id == battle.allyCurrentPokemon.id) || (key == pkmnBattleKey.MessagePokemonNameNewChallenger.Enemy && currentPkmn.id == battle.enemyCurrentPokemon.id)
}

function isEnemyPokemonFainted(key: string, currentPkmn: Monster, battle: Battle): boolean {
    return (currentPkmn.id == battle.currentEnemyPokemonTurn.id && key == pkmnBattleKey.FaintedMessage && currentPkmn.id == battle.enemyCurrentPokemon.id);
}
