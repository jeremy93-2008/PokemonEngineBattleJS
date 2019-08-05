export default class Attacks {
  /**
   * Create Attack object to use it against Pokemon in a Battle
   */
    constructor(public name:string, public damage: number, public typing: string,
      public accuracy: number, public attType: string, public pic: string){
      this.name = name;
      this.damage = damage;
      this.typing = typing;
      this.accuracy = accuracy;
      this.pic = pic;
      this.attType = attType;
    }
  };