import Monster from "./monster";
import Attacks from "./attack";
import randomGenerator from "lodash.random";
import { pkmnAttacks } from "./pkmnAttacks";
import { getComputerAttack } from "./computerAI";
import clone from "lodash.clonedeep";
import random from "lodash.random";

export class Battle {
  private pkmnTeamAlly: Monster[];
  private pkmnTeamEnemy: Monster[];

  public allyPkmnIndex: number;
  public enemyPkmnIndex: number;

  private attacksEnemy: Attacks[];

  constructor(teamAlly: Monster[], teamEnemy: Monster[]) {
    this.pkmnTeamAlly = teamAlly;
    this.pkmnTeamEnemy = teamEnemy;
    this.allyPkmnIndex = 0;
    this.enemyPkmnIndex = 0;
    this.attacksEnemy = [];
  }

  selectPokemonToFight(allyPkmnIndex: number, enemyPkmnIndex: number) {
    this.allyPkmnIndex = allyPkmnIndex;
    this.enemyPkmnIndex = enemyPkmnIndex;
    if(this.attacksEnemy.length < 1) 
      this.selectAttacksForComputer();
  }

  humanRound(attack: Attacks) {
    return this.makeAttack(this.pkmnTeamAlly[this.allyPkmnIndex], 
      this.pkmnTeamEnemy[this.enemyPkmnIndex], attack);
  }

  computerRound() {
    return this.makeAttack(this.pkmnTeamEnemy[this.enemyPkmnIndex],
      this.pkmnTeamAlly[this.allyPkmnIndex], getComputerAttack(this.attacksEnemy, this.pkmnTeamAlly[this.allyPkmnIndex]));
  }

  makeAttack(attacker: Monster, defender: Monster, attack: Attacks) {
    // We see if the attacker can attack with its current status, if not the case we return a simple object with 0 damage
    if(this.unableStatus(attacker)) return {0, 0, attack};

    let attPower;
    let defPower;
    let modifier = 1;
    let bonification = 1;
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
    };
    
    defender.stats.hp -= damage;   
    if (defender.stats.hp < 0) { defender.stats.hp = 0; }

    // Apply status on Pokemon
    this.AddStatusToPkmn(attacker, defender, attack);

    return {damage, modifier, attack};
  }

  applyStatus(attacker: Monster, defender: Monster) {
    if(attacker.currentStatus.effect == "normal") return;
    const damage8 = attacker.maxHP / 8;
    const damage16 = attacker.maxHP / 16;
    const randomValue = Math.random();
    switch(attacker.currentStatus.effect) {
      case "burned":
        attacker.stats.hp -= damage8;
        return {damage: damage8}
      case "confused":
      case "poisoned":
        if(randomValue > 0.5) return {damage: 0};
        attacker.stats.hp -= damage16;
        return {damage: damage16}
      default:
        return {damage: 0};
    }
  }

  private unableStatus(attacker: Monster, defender: Monster) {
    this.reduceTurnStatus(attacker);
    if(attacker.currentStatus.effect == "normal" ||
      attacker.currentStatus.turnEffect <= -1) return false;
    const random = Math.random();
    switch(attacker.currentStatus.effect) {
      case "paralysis":
        return random < 0.5;
      case "frozen":
        return true;
      case "sleep":
        return true;
      default:
        return false;
    }
  }

  private reduceTurnStatus(attacker: Monster)  {
    if(attacker.currentStatus.turnEffect == 0) 
      attacker.currentStatus = { effect: "normal" };
    attacker.currentStatus.turnEffect--;
  }

  private AddStatusToPkmn(attacker: Monster, defender: Monster, attack: Attacks) {
    if(!attack.status && attacker.currentStatus.effect != "normal") return;
    const status = clone(attacker.currentStatus);
    status.turnEffect = this.uniqueTurnEffectNumber(status.turnEffect);
    attacker.currentStatus = status;
  }
  
  private clearEnemyAttack() {
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
    const pkmn = this.pkmnTeamEnemy[this.enemyPkmnIndex];
    this.attacksEnemy = pkmnAttacks.getRamdomAttacksPokemon(pkmn.toPokemon(), pkmn.level, true);
  }
}