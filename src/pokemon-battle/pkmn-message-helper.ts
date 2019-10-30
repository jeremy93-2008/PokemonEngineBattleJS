import { battle, messagesList } from "./pkmn-message-core";
import Attacks from "../core/attack";
import { getComputerAttack } from "../core/computerAI";
import { AttackLaunchedMessage, UnableAttackMessage, DamageAttackMessage, AttackForUser, FaintedMessage } from "./pkmn-message";
import Monster from "../core/monster";

export function onClickAttackForUser(selectedAtt: Attacks) {
    roundAttack(selectedAtt);
}

function addMessageRound(unableAttack: boolean) {
    if(unableAttack) {
        messagesList.push(UnableAttackMessage());
        return;
    }
    messagesList.push(AttackLaunchedMessage());
    messagesList.push(DamageAttackMessage());
    if(isFaintedMessage(battle.currentEnemyPokemonTurn))
        messagesList.push(FaintedMessage());
}

function roundAttack(selectedAtt: Attacks) {
    setMessageListEmoty();
    let unableToAttack = false;
    const enemyAttack = getComputerAttack(battle.attacksEnemy, battle.allyCurrentPokemon);
    unableToAttack = battle.doRound(selectedAtt, enemyAttack).unableToAttack;
    addMessageRound(unableToAttack);
    unableToAttack = battle.doRound(selectedAtt, enemyAttack).unableToAttack;
    addMessageRound(unableToAttack)
}

function isFaintedMessage(pkmn: Monster) {
    return pkmn.stats.hp === 0
}

function setMessageListEmoty() {
    if(messagesList.length > 0)
        messagesList.pop();
}