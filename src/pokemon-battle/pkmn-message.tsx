import React from "react";
import { PkmnActionMessage, PkmnStateMessage, PkmnRoundMessage, dispatchAnimaton, PkmnMessage } from "./typing/pkmn-battle";
import { Battle } from "../core/battle";
import Attacks from "../core/attack";
import { dispatchAnimation } from "./pkmn-animation";
import { PokemonList } from "./pkmn-list";
import { PokemonObject, PkmnEffect } from "./typing/pkmn.def";
import { getComputerPokemon } from "../core/computerAI";
import Monster from "../core/monster";

export function reducerMessage(action: PkmnActionMessage, state: PkmnStateMessage): PkmnMessage {
    switch (action) {
        case "Attack": return AttacksForUser(action, state);
        case "PokemonList": return PokemonListForUser(action, state);
        case "MessageStart": return MessageStart(action, state);
        case "MessageAttack": return MessageAttackUsed(action, state);
        case "MessageEffectiveness": return MessageAttackEffectiveness(action, state);
        case "MessageDamage": return MessageAttackDamage(action, state);
        case "MessageFainted": return MessageFainted(action, state);
        case "MessagePokemonChanging": return MessagePokemonChanging(action, state);
        case "MessagePokemonChanged": return MessagePokemonChanged(action, state);
        case "MessageUnableStatus": return MessageUnableStatus(action, state);
        default: return AttacksForUser(action, state);
    }
}

function MessageStart(action: PkmnActionMessage, state: PkmnStateMessage): PkmnMessage {
    const { setMessage } = state;
    const trainer = state.enemy.trainer ? state.enemy.trainer.name : null;
    const onClickMessage = () => {
        setMessage(reducerMessage("Attack", {...state, beginBattle: true, human: true}));
    };

    if(trainer) {
        return Message(`¡${trainer} te reta a un combate!`, onClickMessage, action, state)        
    }

    return Message(`¡Un Pokemon Salvaje hace su aparición!`, onClickMessage, action, state);
}

function AttacksForUser(action: PkmnActionMessage, state: PkmnStateMessage): PkmnMessage {
    const { ally, enemy, battle, setMessage, setAnimation, setEnemy, setAlly } = state;

    const pkmn = (state.human) ? ally.team[battle.enemyPkmnIndex] : enemy.team[battle.allyPkmnIndex];
    const pokemonAllySelected = battle.allyPkmnIndex;
    const pokemonEnemySelected = battle.enemyPkmnIndex;

    return Message(<>
        <button onClick={() => {
            setMessage(reducerMessage("PokemonList", { ally, enemy, battle, setMessage, setAnimation, setEnemy, setAlly, human: false, pkmnStrategicChange: true }));
        }} className="change-pokemon">Change Pokemon</button>
        {ally.team[battle.allyPkmnIndex].attacks.map((att, i) =>
            <div key={i} onClick={() => {
                (battle as Battle).selectPokemonToFight(pokemonAllySelected, pokemonEnemySelected);
                const { damage, modifier, attack } = battle.humanRound(att);
                const state = {
                    ally, enemy, attack: att, battle,
                    setAnimation, pokemonRound: { damage, modifier }, setMessage, human: true, setEnemy, setAlly,
                    beginBattle: false
                }

                if(PkmnHaveAlteredPreAttackStatus(pkmn)) {
                    setMessage(reducerMessage("MessageUnableStatus", {...state, pokemonRound: {damage, modifier, attack}}))
                    return;
                }

                setMessage(reducerMessage("MessageAttack", state));
            }} className="att">{att.name}</div>)}</>, () => {}, action, state);
}

function MessageAttackUsed(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, attack, battle,
        setMessage, setAnimation, pokemonRound, human, setEnemy, setAlly } = state;

    const pkmnMessage = (state.human) ? ally : enemy;
    const pkmnIndex = (state.human) ? battle.allyPkmnIndex : battle.enemyPkmnIndex;
    const pkmn = pkmnMessage.team[pkmnIndex];
    
    if((pokemonRound as PkmnRoundMessage).damage > 0)
        dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));

    return Message(`¡${pkmn.name} ha usado ${(attack as Attacks).name}!`, () => {
        setMessage(reducerMessage("MessageEffectiveness", { attack, battle, ally, enemy, pokemonRound, setMessage, setAnimation, human, setEnemy, setAlly }));
    }, action, state);
}

function MessageAttackEffectiveness(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, battle, setMessage, setAnimation,
        pokemonRound, human, setEnemy, setAlly } = state;

    let effectiveness = null;

    const pkmn = (state.human) ? enemy.team[battle.enemyPkmnIndex] : ally.team[battle.allyPkmnIndex];
    const enemigo = (human) ? "enemigo" : "";

    if ((pokemonRound as PkmnRoundMessage).damage == 0 && pkmn.currentStatus.effect == "normal") {
        effectiveness = `${pkmn.name} ${enemigo} ha esquivado el ataque`;
    } else if ((pokemonRound as PkmnRoundMessage).modifier == 0) {
        effectiveness = `${pkmn.name} ${enemigo} es inmune al ataque`;
    } else if ((pokemonRound as PkmnRoundMessage).modifier == 2) {
        effectiveness = "Es super efectivo";
    }
    
    dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));

    return (effectiveness) ? Message(`¡${effectiveness}!`, () => {
        setMessage(reducerMessage("MessageDamage", { ally, battle, enemy, setMessage, setAnimation, pokemonRound, human, setEnemy, setAlly }));
    }, action, state) : reducerMessage("MessageDamage", { ally, battle, enemy, setMessage, setAnimation, pokemonRound, human, setEnemy, setAlly });
}

function MessageAttackDamage(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, battle, setMessage,
        setAnimation, pokemonRound, human, setEnemy, setAlly } = state;

    const pkmn = (human) ? enemy.team[battle.enemyPkmnIndex] : ally.team[battle.allyPkmnIndex];
    const enemigo = (human) ? "enemigo" : "";
    const percentageDamage = calculatePercentage(pokemonRound, pkmn).toFixed(2);

    dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));

    let text = `${pkmn.name} ${enemigo} ha perdido ${percentageDamage}% de puntos de vida`;

    if (parseInt(percentageDamage) == 0) {
        text = `${pkmn.name} ${enemigo} no ha recibido ningún daño`;
    }

    return Message(text, () => {
        if (pkmn.stats.hp <= 0) {
            setMessage(reducerMessage("MessageFainted", {ally, battle, enemy, setMessage, setAnimation, setEnemy, setAlly, human}));
            return;
        }

        if (!state.human) {
            setMessage(reducerMessage("Attack", { ally, battle, enemy, setMessage, setAnimation , setEnemy, setAlly, human: true}));
            return;
        }

        const { attack, damage, modifier } = (battle as Battle).computerRound(state.hurtItself as boolean);

        if(PkmnHaveAlteredPreAttackStatus(pkmn)) {
            setMessage(reducerMessage("MessageUnableStatus", {...state, pokemonRound: {damage, modifier, attack}}));
            return;
        }

        state.human = !state.human;
        
        setMessage(reducerMessage("MessageAttack", {
            ally, enemy, battle, attack,
            setMessage, setAnimation, pokemonRound: { damage, modifier }, human: state.human, setAlly, setEnemy
        }));
    }, action, state);
}
function MessageFainted(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, battle, setMessage,
        setAnimation, pokemonRound, human, setEnemy, setAlly } = state;

    const pkmn = (state.human) ? enemy.team[battle.enemyPkmnIndex] : ally.team[battle.allyPkmnIndex];
    const enemigo = (human) ? "enemigo" : "";
    const teamPokemonFainted = ally.team.map(monster => (monster.stats.hp == 0) ? monster.toPokemon() : null).filter(p => p);
    const teamEnemyPokemonFainted = enemy.team.map(monster => (monster.stats.hp == 0) ? monster.toPokemon() : null).filter(p => p);

    const isOver = teamPokemonFainted.length >= ally.team.length || teamEnemyPokemonFainted.length >= enemy.team.length;

    dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));
    
    return Message(<div>
        {`${pkmn.name} ${enemigo} se ha debilitado.`}
        </div>, () => {
            if(isOver) {
                location.reload();
            }

            if(!human) {
                setMessage(reducerMessage("PokemonList", { ally, enemy, battle, setMessage,
                    setAnimation, pokemonRound, human, setEnemy, setAlly }));
                return;            
            }

            const nextMonster = getComputerPokemon(enemy.team, ally.team[battle.allyPkmnIndex]);
            battle.clearEnemyAttack();
            battle.selectPokemonToFight(battle.allyPkmnIndex, (nextMonster.index as number));
            setMessage(reducerMessage("MessagePokemonChanging", {ally, enemy, battle,
                setMessage, setAnimation, setAlly, setEnemy, human}));
            
        }, action, state);
}

function MessagePokemonChanging(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, battle, setMessage,
        setAnimation, pokemonRound, human, setEnemy, setAlly } = state;   
        
    const pkmn = enemy.team[battle.enemyPkmnIndex];

    dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));

    return Message(<div>
        {`${enemy.trainer.name} envía a ${pkmn.name}`}
        <br /><br />
        {`¿Quieres cambiar de pokemon?`}
        <br /><br />
        {["Sí","No"].map(text => <div onClick={() => {
            if(text == "No") {
                setMessage(reducerMessage("Attack", {ally, enemy, battle,
                setMessage, setAnimation, setAlly, setEnemy, human}))
                return;
            }
            setMessage(reducerMessage("PokemonList", {ally, enemy, battle,
                setMessage, setAnimation, setAlly, setEnemy, human, pokemonRound, pkmnRoundChange: true}));
        }} className="att">{text}</div>)}
    </div>, () => {}, action, state); 
}

function MessagePokemonChanged(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, battle, setMessage,
        setAnimation, setEnemy, setAlly } = state;   
        
    const pkmn = ally.team[battle.allyPkmnIndex];

    dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));
    
    return Message(`${ally.trainer.name} envía a ${pkmn.name}`, () => {
        if(!state.pkmnRoundChange && state.human || state.pkmnStrategicChange) {
            const { attack, damage, modifier } = (battle as Battle).computerRound(false);
            setMessage(reducerMessage("MessageAttack", {
                ally, enemy, battle, attack,
                setMessage, setAnimation, pokemonRound: {damage, modifier}, human: false, setAlly, setEnemy, pkmnStrategicChange: false
            }))
            return;    
        }
        setMessage(reducerMessage("Attack", {ally, enemy, battle,
            setMessage, setAnimation, setAlly, setEnemy}));
    }, action, state)
}

function PokemonListForUser(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, battle, setMessage,
        setAnimation, setEnemy, setAlly, pkmnStrategicChange, pkmnRoundChange } = state;

    const teamPokemonFainted = ally.team.map(monster => (monster.stats.hp == 0) ? monster.toPokemon() : null).filter(p => p);

    dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));

    return Message(<div>
        {<>
            <p>Selecciona otro pokemon</p> 
            <PokemonList pkmns={ally.team} details={{hp: true}} disabled={(teamPokemonFainted as PokemonObject[])} 
                className="pokemon-list-fainted" classForCell="pokemon-each-fainted" onClick={(pkmn) => {
                    const nextMonster = pkmn as Monster;
                    const index = ally.team.map((pkmn, i) => (pkmn.name == nextMonster.name) ? i : -1).find(index => index > -1);
                    battle.selectPokemonToFight((index as number), battle.enemyPkmnIndex);
                    setMessage(reducerMessage("MessagePokemonChanged", {
                            ally, enemy, battle,
                            setMessage, setAnimation, pkmnStrategicChange, human: state.human, setAlly, setEnemy, pkmnRoundChange
                    }));
        }}></PokemonList></>}
        </div>, () => {}, action, state);
}

function MessageUnableStatus(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, battle, setMessage,
        setAnimation, setEnemy, setAlly, pkmnStrategicChange, pkmnRoundChange, pokemonRound } = state;
    
    const pkmn = (state.human) ? enemy.team[battle.enemyPkmnIndex] : ally.team[battle.allyPkmnIndex];

    let damageByConfusion = 0;
    if(pkmn.currentStatus.effect == "confused") {
        const { damage } = battle.applyStatus(pkmn);
        damageByConfusion = damage;
        dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));
    }

    return Message(`${pkmn.name} está ${effectNameLang(pkmn.currentStatus.effect)}.`, () => {
        state.human = !state.human;
        state.hurtItself = damageByConfusion > 0;
        setMessage(reducerMessage("MessageDamage", state))
    }, action, state);
}

/**
 * Create a JSX.Element to the bottom container that can host a message that can be a text or anothers jsx.element
 * @param child 
 * @param onClick 
 */
function Message(child: string | JSX.Element, onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void, action: PkmnActionMessage, state: PkmnStateMessage): PkmnMessage {
    return {
        render: <div onClick={onClick}>{child}</div>,
        action,
        state
    }
}

function PkmnHaveAlteredPreAttackStatus(pkmn: Monster) {
    return pkmn.currentStatus.effect == "paralysis" 
                || pkmn.currentStatus.effect == "frozen" 
                || pkmn.currentStatus.effect == "sleep"
                || pkmn.currentStatus.effect == "flinch"
                || pkmn.currentStatus.effect == "confused"
}

function effectNameLang(effect: PkmnEffect | undefined) {
    switch(effect) {
        case "burned": return "quemado";
        case "confused": return "confuso";
        case "flinch": return "retrociendo";
        case "frozen": return "congelado";
        case "paralysis": return "paralizado";
        case "poisoned": return "envenenado";
        case "sleep": return "durmiendo";
    }
    return effect;
}

function calculatePercentage(pokemonRound: PkmnRoundMessage | undefined, pkmn: Monster) {
    const percentage = (((pokemonRound as PkmnRoundMessage).damage * 100) / pkmn.maxHP);
    return percentage > 100 ? 100 : (((pokemonRound as PkmnRoundMessage).damage * 100) / pkmn.maxHP);
}