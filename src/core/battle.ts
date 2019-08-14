import Monster from "./monster";
import Attacks from "./attack";
import uniqueRandom = require("unique-random");
import { pkmnAttacks } from "./pkmnAttacks";

export class Battle {
  public isHumanTurn: boolean;

  private pkmnTeamAlly: Monster[];
  private pkmnTeamEnemy: Monster[];

  private allyPkmnIndex: number;
  private enemyPkmnIndex: number;

  private attacksEnemy: Attacks[];

  constructor(teamAlly: Monster[], teamEnemy: Monster[]) {
    this.pkmnTeamAlly = teamAlly;
    this.pkmnTeamEnemy = teamEnemy;
    this.allyPkmnIndex = 0;
    this.enemyPkmnIndex = 0;
    this.isHumanTurn = true;
    this.attacksEnemy = [];
  }

  selectPokemonToFight(allyPkmnIndex: number, enemyPkmnIndex: number) {
    this.allyPkmnIndex = allyPkmnIndex;
    this.enemyPkmnIndex = enemyPkmnIndex;

    this.selectAttacksForComputer();
  }

  humanRound(attack: Attacks) {
    return this.makeAttack(this.pkmnTeamAlly[this.allyPkmnIndex], 
      this.pkmnTeamEnemy[this.enemyPkmnIndex], attack);
  }

  computerRound() {

  }

  makeAttack(attacker: Monster, defender: Monster, attack: Attacks) {
    const random = uniqueRandom(85, 100);
    let attPower;
    let defPower;
    let modifier = 1;
    let bonification = 1;
    let variant = random() / 100;
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

    this.isHumanTurn = false;
    return {damage, modifier};
  }

  private selectAttacksForComputer() {
    const pkmn = this.pkmnTeamEnemy[this.enemyPkmnIndex];
    this.attacksEnemy = pkmnAttacks.getRandomAttacksObjectForPkmn(pkmn.toPokemon(), pkmn.level);
  }

}