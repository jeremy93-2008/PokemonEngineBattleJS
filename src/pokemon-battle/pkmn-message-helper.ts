import { battle, messagesList, battlesList } from "./pkmn-message-core";
import Attacks from "../core/attack";
import { getComputerAttack, getComputerPokemon } from "../core/computerAI";
import { AttackLaunchedMessage, UnableAttackMessage, DamageAttackMessage, AttackForUser, FaintedMessage, EvadedAttackMessage, PokemonChooseForUser, MessagePokemonName, PokemonCanBeChangedForUser } from "./pkmn-message";
import Monster from "../core/monster";
import { PkmnBattleReturn } from "./typing/pkmn.def";
import cloneDeep = require("lodash.clonedeep");

export const pkmnBattleKey = {
    MessageStart: "MessageStart",
    MessagePokemonName: "MessagePokemonName",
    AttackForUser: "AttackForUser",
    PokemonChooseForUser: "PokemonChooseForUser",
    PokemonCanBeChangedForUser: "PokemonCanBeChangedForUser",
    AttackLaunchedMessage: "AttackLaunchedMessage",
    UnableAttackMessage: "UnableAttackMessage",
    DamageAttackMessage: "DamageAttackMessage",
    FaintedMessage: "FaintedMessage",
    EvadedAttackMessage: "EvadedAttackMessage"
}

export function onClickAttackForUser(selectedAtt: Attacks) {
    roundAttack(selectedAtt);
}

export function onClickPokemonChooseForUser(indexNextPkmn: number) {
    battle.selectPokemonToFight(indexNextPkmn, battle.enemyPkmnIndex);
    setMessageListEmpty();
    setBattleListEmpty();
    setBattleWhenPkmnChanged();
    messagesList.push(AttackForUser());
}

export function onClickPokemonCanBeChangedForUser() {
    setMessageListEmpty();
    setBattleListEmpty();
    messagesList.push(PokemonChooseForUser());
}

export function onClickPokemonContinueWithoutChanging() {
    setMessageListEmpty();
    setBattleListEmpty();
    messagesList.push(AttackForUser())
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
    setBattleListEmpty();
    const enemyAttack = getComputerAttack(battle.attacksEnemy, battle.allyCurrentPokemon);
    const roundOne = battle.doRound(selectedAtt, enemyAttack);
    setBattleWhenPkmnAttack();
    const canContinue = addMessageRound(roundOne);
    if(canContinue) {
        const roundTwo = battle.doRound(selectedAtt, enemyAttack);
        setBattleWhenPkmnAttack();
        addMessageRound(roundTwo);
    }
    if(isFaintedMessage(battle.allyCurrentPokemon)) {
        messagesList.push(PokemonChooseForUser());
        setBattleWhenPkmnFaint();
        messagesList.push(MessagePokemonName(battle.trainers.you, battle.allyCurrentPokemon))
        return;
    }
    if(isFaintedMessage(battle.enemyCurrentPokemon)) {
        const index = getComputerPokemon(battle.enemyPokemonTeam, battle.allyCurrentPokemon).index;
        battle.selectPokemonToFight(battle.allyPkmnIndex, index, true)
        setBattleWhenPkmnFaint();
        setBattleWhenPkmnChanged();
        messagesList.push(MessagePokemonName(battle.trainers.her, battle.enemyCurrentPokemon))
        messagesList.push(PokemonCanBeChangedForUser());
        return;
    }
    if(isFaintedAllTeam()) {
        setBattleWhenPkmnFaint();
        alert("Has ganado!");
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

function setBattleListEmpty() {
    if(battlesList.length > 0)
        battlesList.pop();
}

function setBattleWhenPkmnAttack() {
    battlesList.push({
        key: pkmnBattleKey.AttackLaunchedMessage,
        battle: cloneDeep(battle)
    })
}

function setBattleWhenPkmnFaint() {
    battlesList.push({
        key: pkmnBattleKey.FaintedMessage,
        battle: cloneDeep(battle)
    })    
}

function setBattleWhenPkmnChanged() {
    battlesList.push({
        key: pkmnBattleKey.AttackForUser,
        battle: cloneDeep(battle)
    })
}