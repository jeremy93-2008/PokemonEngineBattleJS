import Monster from "./monster";
import Attacks from "./attack";

// gameplay logic

export default class Battle {
  private player: Monster;
  private comp: Monster;
  private rendering: boolean;

  constructor(m1: Monster, m2: Monster) {
    this.player = m1;
    this.comp = m2;
    this.rendering = false;
  }

  doRound(pA: number) {
    // Prevent user from spamming button while animation is going on
    if (this.rendering) {
      return;
    }
    this.rendering = true;

    let d1: number = 0;
    let d2: number = 0;

    //determine first attacker
    const { a1, a2, f1, f2, firstAttacker, firstAttackerAttack, secondAttacker, secondAttackerAttack }
      = (this.player.stats.speed < this.comp.stats.speed) ? this.orderedDataPlayer(this.comp, this.player, pA) :
        this.orderedDataPlayer(this.player, this.comp, pA);

    //first attacker attacks
    d1 = this.attack(firstAttacker, secondAttacker, firstAttackerAttack);

    if (secondAttacker.stats.hp <= 0) {
      this.gameOver(firstAttacker);
      this.rendering = false;
      return { f1: f1, f2: f2, a1: a1, a2: a2, d1: d1, d2: d2 };
    }
    //check if second attacker is still alive to attack, and attack
    d2 = this.attack(secondAttacker, firstAttacker, secondAttackerAttack);

    if (firstAttacker.stats.hp <= 0) {
      this.gameOver(secondAttacker);
      this.rendering = false;
      return { f1: f1, f2: f2, a1: a1, a2: a2, d1: d1, d2: d2 };
    }

    this.rendering = false;
    return { f1: f1, f2: f2, a1: a1, a2: a2, d1: d1, d2: d2 };
  }

  attack(offender: Monster, defender: Monster, attNum: number) {
    // Determine how to proceed depending if attack is a damager or buffer
    let attPower;
    let defPower;
    let modifier = 1;
    let att = offender.attacks[attNum];
    if (att.attType == "matt") {
      attPower = offender.stats.matt;
      defPower = defender.stats.mdef;
    } else {
      attPower = offender.stats.att;
      defPower = defender.stats.def;
    };

    if (att.typing === defender.weakness) {
      modifier = 2;
    } else if (att.typing === defender.strength) {
      modifier = 0.75;
    };

    let damage = Math.floor((((((50 / 7) * attPower * att.damage)) / (defPower * 50)) + 2) * modifier * (Math.floor((Math.random() * 38) + 217) / 255));
    if ((Math.random() * 100) >= att.accuracy) {
      damage = 0;
    };

    defender.stats.hp -= damage;
    if (defender.stats.hp < 0) { defender.stats.hp = 0; }
    return damage;
  }

  gameOver(winner: Monster) {
    if (winner === this.player) {
      console.log("Victory");
    } else {
      console.log("Defeat");
    };
  }

  private orderedDataPlayer(firstMonster: Monster, secondMonster: Monster, pA: number) {
    let firstAttacker = firstMonster;
    let secondAttacker = secondMonster;
    let firstAttackerAttack = Math.floor(Math.random() * 4);
    let secondAttackerAttack = pA;
    let f1 = this.comp;
    let f2 = this.player;
    let a1 = this.comp.attacks[firstAttackerAttack];
    let a2 = this.player.attacks[secondAttackerAttack];

    return { firstAttacker, secondAttacker, firstAttackerAttack, secondAttackerAttack, f1, f2, a1, a2 }
  }

};