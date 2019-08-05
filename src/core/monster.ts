import Attacks from "./attack";

interface stats {
  hp: number;
  att: number,
  matt: number,
  def: number,
  mdef: number,
  speed: number
}

export default class Monster {
  public maxHP: number;
  /**
 * Create a New Pokemon ready to fight
 */
  constructor(public name: string, public stats: stats, public attacks: Attacks[], public typing: string, public weakness: string, public strength: string, public human: boolean) {
    this.stats = stats;
    this.attacks = attacks;
    this.typing = typing;
    this.name = name;
    this.weakness = weakness;
    this.strength = strength;
    this.human = human;
    this.maxHP = stats.hp;
  }

  getNewInstanceOfMonster(human: boolean) {
    let newMonster = new Monster(this.name, Object.assign({}, this.stats), Object.assign([], this.attacks), this.typing, this.weakness, this.strength, human);
    return newMonster;
  }
};