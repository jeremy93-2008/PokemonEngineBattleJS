import { PkmnStatusChange } from "../pokemon-battle/typing/pkmn.def";

export default class Attacks {
  /**
   * Create Attack object to use it against Pokemon in a Battle
   */
  constructor(public name: string, public damage: number, public typing: string,
    public accuracy: number, public attType: string, public pic: string, public status: PkmnStatusChange, public acurracyStatus: number) {
    this.name = name;
    this.damage = damage;
    this.typing = typing;
    this.accuracy = accuracy;
    this.pic = pic;
    this.attType = attType;
    this.status = status;
    this.acurracyStatus = acurracyStatus;
  }
};