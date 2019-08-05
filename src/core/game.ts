import Monster from "./monster";

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

  genSequence(pA: number) {
    // Prevent user from spamming button while animation is going on
    if (this.rendering) {
      return;
    }
    this.rendering = true;

    let firstAttacker;
    let secondAttacker;
    let firstAttackerAttack;
    let secondAttackerAttack;
    let f1;
    let f2;
    let d1;
    let d2;
    let a1;
    let a2;
    //determine first attacker
    if (this.player.stats.speed < this.comp.stats.speed) {
      firstAttacker = this.comp;
      secondAttacker = this.player;
      firstAttackerAttack = Math.floor(Math.random() * 4);
      secondAttackerAttack = pA;
      f1 = this.comp;
      f2 = this.player;
      a1 = this.comp.attacks[firstAttackerAttack];
      a2 = this.player.attacks[secondAttackerAttack];

    } else {
      firstAttacker = this.player;
      secondAttacker = this.comp;
      firstAttackerAttack = pA;
      secondAttackerAttack = Math.floor(Math.random() * 4);
      f1 = this.player;
      f2 = this.comp;
      a1 = this.player.attacks[firstAttackerAttack];
      a2 = this.comp.attacks[secondAttackerAttack];
    };

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


};