import React from "react";
import { PkmnActionMessage, PkmnStateMessage, PkmnRoundMessage, dispatchAnimaton } from "./typing/pkmn-battle";
import { Battle } from "../core/battle";
import Attacks from "../core/attack";
import { dispatchAnimation } from "./pkmn-animation";
import { PokemonList } from "./pkmn-list";
import { PokemonObject } from "./typing/pkmn.def";
import { getComputerPokemon } from "../core/computerAI";
import Monster from "../core/monster";

export function reducerMessage(action: PkmnActionMessage, state: PkmnStateMessage): JSX.Element {
    switch (action) {
        case "Attack": return AttacksForUser(action, state);
        case "MessageAttack": return MessageAttackUsed(action, state)
        case "MessageEffectiveness": return MessageAttackEffectiveness(action, state);
        case "MessageDamage": return MessageAttackDamage(action, state);
        case "MessageFainted": return MessageFainted(action, state);
        default: return AttacksForUser(action, state);
    }
}

function AttacksForUser(action: PkmnActionMessage, state: PkmnStateMessage): JSX.Element {
    const { ally, enemy, battle, setMessage, setAnimation, setEnemy, setAlly } = state;
 
    const pokemonAllySelected = battle.allyPkmnIndex;
    const pokemonEnemySelected = battle.enemyPkmnIndex;

    dispatchAnimation(action, (state.human as boolean), (setAnimation as dispatchAnimaton));
    return <>{ally.team[battle.allyPkmnIndex].attacks.map((att, i) =>
        <div key={i} onClick={() => {
            (battle as Battle).selectPokemonToFight(pokemonAllySelected, pokemonEnemySelected);
            const { damage, modifier } = (battle as Battle).humanRound(att);
            setMessage(reducerMessage("MessageAttack", {
                ally, enemy, attack: att, battle,
                setAnimation, pokemonRound: { damage, modifier }, setMessage, human: true, setEnemy, setAlly
            }));
        }} className="att">{att.name}</div>)}</>;
}

function MessageAttackUsed(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, attack, battle,
        setMessage, setAnimation, pokemonRound, human, setEnemy, setAlly } = state;

    const pkmnMessage = (state.human) ? ally : enemy;
    const pkmnIndex = (state.human) ? battle.allyPkmnIndex : battle.enemyPkmnIndex;

    dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));
    return Message(`¡${pkmnMessage.team[pkmnIndex].name} ha usado ${(attack as Attacks).name}!`, () => {
        setMessage(reducerMessage("MessageEffectiveness", { attack, battle, ally, enemy, pokemonRound, setMessage, setAnimation, human, setEnemy, setAlly }));
    });
}

function MessageAttackEffectiveness(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, battle, attack,
        setMessage, setAnimation, pokemonRound, human, setEnemy, setAlly } = state;

    let effectiveness = null;

    const pkmn = (state.human) ? enemy.team[battle.enemyPkmnIndex] : ally.team[battle.allyPkmnIndex];
    const enemigo = (human) ? "enemigo" : "";

    if ((attack as Attacks).attType == "Status") {
        effectiveness = "Los ataques de status todavia no estan implementados"
    } else if ((pokemonRound as PkmnRoundMessage).damage == 0) {
        effectiveness = `${pkmn.name} ${enemigo} ha esquivado el ataque`;
    } else if ((pokemonRound as PkmnRoundMessage).modifier == 0) {
        effectiveness = `${pkmn.name} ${enemigo} es inmune al ataque`;
    } else if ((pokemonRound as PkmnRoundMessage).modifier == 2) {
        effectiveness = "Es super efectivo";
    }

    dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));

    return (effectiveness) ? Message(`¡${effectiveness}!`, () => {
        setMessage(reducerMessage("MessageDamage", { ally, battle, enemy, setMessage, setAnimation, pokemonRound, human, setEnemy, setAlly }));
    }) : reducerMessage("MessageDamage", { ally, battle, enemy, setMessage, setAnimation, pokemonRound, human, setEnemy, setAlly });
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
            setMessage(reducerMessage("Attack", { ally, battle, enemy, setMessage, setAnimation , setEnemy, setAlly}));
            return;
        }
        state.human = !state.human;
        const { attack, damage, modifier } = (battle as Battle).computerRound();
        setMessage(reducerMessage("MessageAttack", {
            ally, enemy, battle, attack,
            setMessage, setAnimation, pokemonRound: { damage, modifier }, human: state.human, setAlly, setEnemy
        }));
    });
}
/// TODO: Animacion cambio Pokemon - M
///       Pokeballs visibles - S
///       Poner final - S
///       La animacion no debe ejecutarse cuando el daño es nulo - XS
///       Integrar status y recarga en general de estos - L
function MessageFainted(action: PkmnActionMessage, state: PkmnStateMessage) {
    const { ally, enemy, battle, setMessage,
        setAnimation, pokemonRound, human, setEnemy, setAlly } = state;

    const pkmn = (state.human) ? enemy.team[battle.enemyPkmnIndex] : ally.team[battle.allyPkmnIndex];
    const enemigo = (human) ? "enemigo" : "";
    const teamPokemonFainted = ally.team.map(monster => (monster.stats.hp == 0) ? monster.toPokemon() : null).filter(p => p);

    dispatchAnimation(action, !(state.human as boolean), (setAnimation as dispatchAnimaton));
    
    return Message(<div>
        {`${pkmn.name} ${enemigo} se ha debilitado.`}
        {(!human) && <>
            <p>Selecciona otro pokemon</p> 
            <PokemonList pkmns={ally.team} details={{hp: true}} disabled={(teamPokemonFainted as PokemonObject[])} 
                className="pokemon-list-fainted" classForCell="pokemon-each-fainted" onClick={(pkmn) => {
                    const nextMonster = pkmn as Monster;
                    const index = ally.team.map((pkmn, i) => (pkmn.name == nextMonster.name) ? i : -1).find(index => index > -1);
                    battle.selectPokemonToFight((index as number), battle.enemyPkmnIndex);
                    setMessage(reducerMessage("Attack", {ally, enemy, battle,
                            setMessage, setAnimation, setAlly, setEnemy}));
        }}></PokemonList></>}
        </div>, () => {
            if(state.human) {
                const nextMonster = getComputerPokemon(enemy.team, ally.team[battle.allyPkmnIndex]);
                battle.clearEnemyAttack();
                battle.selectPokemonToFight(battle.allyPkmnIndex, (nextMonster.index as number));
                setMessage(reducerMessage("Attack", {ally, enemy, battle,
                    setMessage, setAnimation, setAlly, setEnemy}));
            }
        });
}

/**
 * Create a JSX.Element to the bottom container that can host a message that can be a text or anothers jsx.element
 * @param child 
 * @param onClick 
 */
function Message(child: string | JSX.Element, onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) {
    return <div onClick={onClick}>{child}</div>
}

function calculatePercentage(pokemonRound: PkmnRoundMessage | undefined, pkmn: import("d:/documentos/Creaciones/PokemonEngineJS/src/core/monster").default) {
    const percentage = (((pokemonRound as PkmnRoundMessage).damage * 100) / pkmn.maxHP);
    return percentage > 100 ? 100 : (((pokemonRound as PkmnRoundMessage).damage * 100) / pkmn.maxHP);
}