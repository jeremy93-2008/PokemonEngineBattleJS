import Monster from "./monster";
import Attacks from "./attack";
import randomGenerator from "lodash.random";
import { pkmnAttacks } from "./pkmnAttacks";
import clone from "lodash.clonedeep";
import random from "lodash.random";
import { PkmnCurrentStatus, PkmnBattleReturn } from "../pokemon-battle/typing/pkmn.def";
import { PkmnTrainers } from "../pokemon-battle/typing/pkmn-battle";

export class Battle {
  public allyPokemonTeam: Monster[];
  public enemyPokemonTeam: Monster[];

  public trainers: PkmnTrainers;

  public allyPkmnIndex: number;
  public enemyPkmnIndex: number;

  public allyCurrentPokemon: Monster;
  public enemyCurrentPokemon: Monster;

  public currentPokemonTurn: Monster;
  public currentEnemyPokemonTurn: Monster;
  public currentAttackDamageTurn: number;
  public currentAttackResult: PkmnBattleReturn | null;

  public attacksEnemy: Attacks[];

  public attackLaunched: Attacks;

  constructor(teamAlly: Monster[], teamEnemy: Monster[], trainers: PkmnTrainers) {
    this.allyPokemonTeam = teamAlly;
    this.enemyPokemonTeam = teamEnemy;
    this.allyPkmnIndex = 0;
    this.enemyPkmnIndex = 0;
    this.attacksEnemy = [];
    this.allyCurrentPokemon = teamAlly[0];
    this.enemyCurrentPokemon = teamEnemy[0];
    this.currentPokemonTurn = this.allyCurrentPokemon;
    this.currentEnemyPokemonTurn = this.enemyCurrentPokemon;
    this.currentAttackDamageTurn = 0;
    this.currentAttackResult = null;
    this.attackLaunched = this.allyCurrentPokemon.attacks[0];
    this.trainers = trainers;
    this.selectPokemonToFight(0, 0);
  }

  selectPokemonToFight(allyPkmnIndex: number, enemyPkmnIndex: number, changeEnemyAttacks?: boolean) {
    this.allyPkmnIndex = allyPkmnIndex;
    this.enemyPkmnIndex = enemyPkmnIndex;

    this.allyCurrentPokemon = this.allyPokemonTeam[allyPkmnIndex];
    this.enemyCurrentPokemon = this.enemyPokemonTeam[enemyPkmnIndex];
    
    if(changeEnemyAttacks || this.attacksEnemy.length < 1)
      this.selectAttacksForComputer();
  }

  public doRound(allyAttack: Attacks, enemyAttack: Attacks) {
    let firstToAttack = this.allyPokemonTeam[this.allyPkmnIndex];
    let secondToAttack = this.enemyPokemonTeam[this.enemyPkmnIndex];
    let attack = allyAttack;

    if(firstToAttack.stats.speed < secondToAttack.stats.speed) {
      firstToAttack = this.enemyPokemonTeam[this.enemyPkmnIndex];
      secondToAttack = this.allyPokemonTeam[this.allyPkmnIndex];
      attack = enemyAttack;
    }

    firstToAttack.stats.speed = 0;

    if(firstToAttack.stats.speed == 0 && secondToAttack.stats.speed == 0) {
      firstToAttack.stats.speed = firstToAttack.maxSpeed;
      secondToAttack.stats.speed = secondToAttack.maxSpeed;
    }

    this.currentPokemonTurn = firstToAttack;
    this.currentEnemyPokemonTurn = secondToAttack;
    this.attackLaunched = attack;

    return this.makeAttack(firstToAttack, secondToAttack, attack)
  }

  private makeAttack(attacker: Monster, defender: Monster, attack: Attacks): PkmnBattleReturn {
    // We see if the attacker can attack with its current status, if not the case we return a simple object with 0 damage
    this.currentAttackResult = {damage: 0, modifier: 0, attack, unableToAttack: true, attackEvaded: false};
    if(this.unableStatus(attacker)) return this.currentAttackResult;

    let attPower;
    let defPower;
    let modifier = 1;
    let bonification = 1;
    let attackEvaded = false;
    let variant = randomGenerator(85, 100) / 100;
    if (attack.attType == "Special") {
      attPower = attacker.stats.matt;
      defPower = defender.stats.mdef;
    } else {
      attPower = attacker.stats.att;
      defPower = defender.stats.def;
    };

    if (defender.weakness.indexOf(attack.typing) !== -1) {
      modifier = 2;
    } else if (defender.strength.indexOf(attack.typing) !== -1) {
      modifier = 0.75;
    } else if (defender.inmunities.indexOf(attack.typing) !== -1) {
      modifier = 0;
    };

    if(attacker.typing.indexOf(attack.typing) != -1) {
      bonification = 1.5;
    }

    let damage = attack.damage == 0 ? 0 : (((2 * attacker.level / 5 + 2) * attPower * attack.damage / defPower) / 50) + 2;

    damage = damage * (bonification * variant * modifier);

    if ((Math.random() * 100) >= attack.accuracy) {
      damage = 0;
      attackEvaded = true;
    };
    
    defender.stats.hp -= damage;   
    if (defender.stats.hp < 0) { defender.stats.hp = 0; }

    // Apply status on Pokemon
    this.AddStatusToPkmn(defender, attack);

    this.currentAttackDamageTurn = damage;

    this.currentAttackResult = {damage, modifier, attack, unableToAttack: false, attackEvaded};

    return this.currentAttackResult;
  }

  applyStatus(currentPokemon: Monster) {
    if(currentPokemon.currentStatus.effect == "normal") return {damage: 0};
    const damage8 = currentPokemon.maxHP / 8;
    const damage16 = currentPokemon.maxHP / 16;
    const randomValue = Math.random();
    switch(currentPokemon.currentStatus.effect) {
      case "burned":
        currentPokemon.stats.hp -= damage8;
        return {damage: damage8}
      case "confused":
      case "poisoned":
        if(randomValue > 0.5) return {damage: 0};
        currentPokemon.stats.hp -= damage16;
        return {damage: damage16}
      case "flinch": 
        return {damage: 0};
      default:
        return {damage: 0};
    }
  }

  private unableStatus(attacker: Monster) {
    this.reduceTurnStatus(attacker);
    const random = Math.random();
    switch(attacker.currentStatus.effect) {
      case "confused":
        return random < 0.33;
      case "paralysis":
        return random < 0.5;
      case "frozen":
        return true;
      case "sleep":
        return true;
      case "flinch":
        return true;
      default:
        return false;
    }
  }

  private reduceTurnStatus(attacker: Monster)  {
    if(attacker.currentStatus.turnEffect == 0) 
      attacker.currentStatus = { effect: "normal" };
    if(attacker.currentStatus.turnEffect)
      attacker.currentStatus.turnEffect--;
  }

  private AddStatusToPkmn(defender: Monster, attack: Attacks) {
    const accuracy = attack.acurracyStatus == 0 ? 100 : attack.acurracyStatus; 
    const ran = random(0, 100);
    if(accuracy > ran) {
      if(typeof attack.status === "string" || defender.currentStatus.effect !== "normal") return;
      const status = {...defender.currentStatus, ...clone(attack.status), allyStat: undefined, enemyStat: undefined};
      status.turnEffect = this.uniqueTurnEffectNumber(status.turnEffect);
      defender.currentStatus = status as PkmnCurrentStatus;
    }
  }
  
  public clearEnemyAttack() {
    this.attacksEnemy = [];
  }

  private uniqueTurnEffectNumber(turn: number | number[] | undefined) {
    if(!turn) return Infinity;
    if(Array.isArray(turn)) {
      return random(turn[0],turn[1])
    }
    return turn;
  }

  private selectAttacksForComputer() {
    const pkmn = this.enemyPokemonTeam[this.enemyPkmnIndex];
    this.attacksEnemy = pkmnAttacks.getRamdomAttacksPokemon(pkmn.toPokemon(), pkmn.level, true);
  }
}
