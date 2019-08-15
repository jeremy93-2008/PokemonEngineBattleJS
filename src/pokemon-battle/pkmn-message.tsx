import React from "react";
import { PkmnActionMessage, PkmnStateMessage, PkmnRoundMessage, dispatchAnimaton } from "./typing/pkmn-battle";
import { Battle } from "../core/battle";
import Attacks from "../core/attack";
import { dispatchAnimation } from "./pkmn-animation";

export function reducerMessage(action: PkmnActionMessage, state: PkmnStateMessage) : JSX.Element {
    switch (action) {
        case "Attack": return AttacksForUser(action, state);
        case "MessageAttack": return MessageAttackUsed(action, state)
        case "MessageEffectiveness": return MessageAttackEffectiveness(action, state);
        case "MessageDamage": return MessageAttackDamage(action, state);
        default: return AttacksForUser(action,state);
    }
}

function AttacksForUser(action:PkmnActionMessage, state: PkmnStateMessage): JSX.Element {
    const {ally, enemy, battle, setMessage, setAnimation} = state;
    
    dispatchAnimation(action, (state.human as boolean), (setAnimation as dispatchAnimaton));
    return <>{ally.team[ally.pokemonSelected].attacks.map((att, i) => 
    <div key={i} onClick={() => {
        (battle as Battle).selectPokemonToFight(ally.pokemonSelected, enemy.pokemonSelected);
        const { damage, modifier } = (battle as Battle).humanRound(att);
        setMessage(reducerMessage("MessageAttack", {ally, enemy, attack: att, battle, 
            setAnimation, pokemonRound: {damage, modifier}, setMessage, human: true} ));
    }} className="att">{att.name}</div>)}</>;
}

function MessageAttackUsed(action: PkmnActionMessage, state: PkmnStateMessage) {
    const {ally, enemy, attack, battle, 
        setMessage, setAnimation, pokemonRound, human } = state;

    const pkmnMessage = (state.human) ? ally : enemy;

    dispatchAnimation(action, (state.human as boolean), (setAnimation as dispatchAnimaton));
    return Message(`¡${pkmnMessage.team[pkmnMessage.pokemonSelected].name} ha usado ${(attack as Attacks).name}!`, () => {
        setMessage(reducerMessage("MessageEffectiveness", {attack, battle, ally, enemy, pokemonRound, setMessage, setAnimation, human}));
    });
}

function MessageAttackEffectiveness(action: PkmnActionMessage, state: PkmnStateMessage) {
    const {ally, enemy, battle, attack, 
        setMessage, setAnimation, pokemonRound, human} = state;
    
    let effectiveness = null;

    const pkmn = (state.human) ? enemy.team[enemy.pokemonSelected] : ally.team[ally.pokemonSelected];
    
    if((attack as Attacks).attType == "Status"){
        effectiveness = "Los ataques de status todavia no estan implementados"
    } else if ((pokemonRound as PkmnRoundMessage).damage == 0) {
        effectiveness = `El ${pkmn.name} rival ha esquivado el ataque`;
    } else if((pokemonRound as PkmnRoundMessage).modifier == 0) {
        effectiveness = `El ${pkmn.name} rival es inmune al ataque`;
    } else if((pokemonRound as PkmnRoundMessage).modifier == 2) {
        effectiveness = "Es super efectivo";
    }

    dispatchAnimation(action, (state.human as boolean), (setAnimation as dispatchAnimaton));

    return (effectiveness) ? Message(`¡${effectiveness}!`, () => {
        setMessage(reducerMessage("MessageDamage", {ally, battle, enemy, setMessage, setAnimation, pokemonRound, human}));
    }) : reducerMessage("MessageDamage", {ally, battle, enemy, setMessage, setAnimation, pokemonRound, human});
}

function MessageAttackDamage(action: PkmnActionMessage, state: PkmnStateMessage) {
    const {ally, enemy, battle, setMessage, 
        setAnimation, pokemonRound, human} = state;

    const pkmn = (human) ? enemy.team[enemy.pokemonSelected] : ally.team[ally.pokemonSelected];
    const enemigo = (human) ? "enemigo" : "";
    const percentageDamage = calculatePercentage(pokemonRound, pkmn).toFixed(2);

    dispatchAnimation(action, (state.human as boolean), (setAnimation as dispatchAnimaton));

    let text = `El ${pkmn.name} ${enemigo} ha perdido ${percentageDamage}% de puntos de vida`;

    if(parseInt(percentageDamage) == 0) {
        text = `El ${pkmn.name} ${enemigo} no ha recibido ningún daño`;
    }

    return Message(text, () => {
        if(!state.human){
            setMessage(reducerMessage("Attack", {ally, battle, enemy, setMessage, setAnimation}));
            return;
        }
        state.human = !state.human;
        const {attack, damage, modifier} = (battle as Battle).computerRound();
        setMessage(reducerMessage("MessageAttack", {ally, enemy, battle, attack, 
            setMessage, setAnimation, pokemonRound: {damage, modifier}, human: state.human }));
    });        
}

function Message(text: string, onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) {
    return <div onClick={onClick}>{text}</div>
}

function calculatePercentage(pokemonRound: PkmnRoundMessage | undefined, pkmn: import("d:/documentos/Creaciones/PokemonEngineJS/src/core/monster").default) {
    const percentage = (((pokemonRound as PkmnRoundMessage).damage * 100) / pkmn.maxHP);
    return percentage > 100 ? 100 : (((pokemonRound as PkmnRoundMessage).damage * 100) / pkmn.maxHP);
}