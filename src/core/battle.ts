import Monster from "./monster";
import Attacks from "./attack";
import randomGenerator from "lodash.random";
import { pkmnAttacks } from "./pkmnAttacks";
import { getComputerAttack } from "./computerAI";

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

    damage = this.changeStatus(attacker, defender, attack, damage);

    defender.stats.hp -= damage;
    if (defender.stats.hp < 0) { defender.stats.hp = 0; }

    return {damage, modifier, attack};
  }

  changeStatus(attacker: Monster, defender: Monster, attack: Attacks, damage: number) {
    const status = attack.status.effect || attacker.currentStatus;
    if(!status) return damage;
    switch(status) 
    {
      case "poisoned":
      case "burned":
        return damage + attacker.maxHP / 16;
      case "flinch": 
        const flinch = Math.random();
        return flinch > 0.5 ? 0 : damage;
      case "confused":
        const conf = Math.random();
        if(conf < 0.33) {
          attacker.stats.hp -= attack.damage;
          return 0;
        }
        return damage;  
      default:
        return damage;      
    }
  }
  
  clearEnemyAttack() {
    this.attacksEnemy = [];
  }

  private selectAttacksForComputer() {
    const pkmn = this.pkmnTeamEnemy[this.enemyPkmnIndex];
    this.attacksEnemy = pkmnAttacks.getRamdomAttacksPokemon(pkmn.toPokemon(), pkmn.level, true);
  }



}