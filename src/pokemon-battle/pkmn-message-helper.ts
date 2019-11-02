import { battle, messagesList } from "./pkmn-message-core";
import Attacks from "../core/attack";
import { getComputerAttack, getComputerPokemon } from "../core/computerAI";
import { AttackLaunchedMessage, UnableAttackMessage, DamageAttackMessage, AttackForUser, FaintedMessage, EvadedAttackMessage, PokemonChooseForUser, MessagePokemonName } from "./pkmn-message";
import Monster from "../core/monster";
import { PkmnBattleReturn } from "./typing/pkmn.def";

export function onClickAttackForUser(selectedAtt: Attacks) {
    roundAttack(selectedAtt);
}

export function onClickPokemonChooseForUser(indexNextPkmn: number) {
    battle.selectPokemonToFight(indexNextPkmn, battle.enemyPkmnIndex);
    setMessageListEmpty();
    messagesList.push(AttackForUser());
}

function addMessageRound(currentRound: PkmnBattleReturn) {
    if(currentRound.unableToAttack) {
        messagesList.push(UnableAttackMessage());
        return;
    }
    messagesList.push(AttackLaunchedMessage());
    if(currentRound.attackEvaded) {
        messagesList.push(EvadedAttackMessage())
    } else {
        messagesList.push(DamageAttackMessage());
    }
    if(isFaintedMessage(battle.currentEnemyPokemonTurn)) {
        messagesList.push(FaintedMessage());
        return false;
    }
    return true;
}

function roundAttack(selectedAtt: Attacks) {
    setMessageListEmpty();
    const enemyAttack = getComputerAttack(battle.attacksEnemy, battle.allyCurrentPokemon);
    const roundOne = battle.doRound(selectedAtt, enemyAttack);
    const canContinue = addMessageRound(roundOne);
    if(canContinue) {
        const roundTwo = battle.doRound(selectedAtt, enemyAttack);
        addMessageRound(roundTwo);
    }
    if(isFaintedMessage(battle.allyCurrentPokemon)) {
        messagesList.push(PokemonChooseForUser());
        messagesList.push(MessagePokemonName(battle.trainers.you, battle.allyCurrentPokemon))
        return;
    }
    if(isFaintedMessage(battle.enemyCurrentPokemon)) {
        const index = getComputerPokemon(battle.enemyPokemonTeam, battle.allyCurrentPokemon).index;
        battle.selectPokemonToFight(battle.allyPkmnIndex, index, true)
        messagesList.push(MessagePokemonName(battle.trainers.her, battle.enemyCurrentPokemon))
    }
    if(isFaintedAllTeam()) {
        alert("Has ganado!")
        location.reload();
    }
    messagesList.push(AttackForUser())
}

function isFaintedMessage(pkmn: Monster) {
    return pkmn.stats.hp === 0
}

function isFaintedAllTeam() {
    return battle.allyPokemonTeam.every(pkmn => pkmn.stats.hp == 0) ||
        battle.enemyPokemonTeam.every(pkmn => pkmn.stats.hp == 0)
}

function setMessageListEmpty() {
    if(messagesList.length > 0)
        messagesList.pop();
}