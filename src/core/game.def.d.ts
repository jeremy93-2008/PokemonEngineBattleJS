import Attacks from "./attack";
import Monster from "./monster";

interface Round {
    attack1: Attacks,
    attack2: Attacks,
    pkmn1: Monster,
    pkmn2: Monster,
    firstAttacker: Monster,
    firstAttackerAttack: number,
    secondAttacker: Monster,
    secondAttackerAttack: number,
    pA: number,
    damage?: number;
}