import Attacks from "./attack";
import pokemonList from "../info/pokemon.json";
import { PokemonObject } from "../pokemon-battle/typing/pkmn.def";

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
  constructor(public name: string, public stats: stats, public attacks: Attacks[], public typing: (string | undefined)[], public weakness: string[], public strength: string[], public human: boolean, public inmunities: string[], public level: number) {
    this.stats = stats;
    this.attacks = attacks;
    this.typing = typing;
    this.name = name;
    this.weakness = weakness || [];
    this.strength = strength || [];
    this.human = human;
    this.maxHP = stats.hp;
    this.inmunities = inmunities || [];
    this.level = level;
  }

  getNewInstanceOfMonster(human: boolean) {
    let newMonster = new Monster(this.name, Object.assign({}, this.stats), Object.assign([], this.attacks), this.typing, this.weakness, this.strength, human, this.inmunities, this.level);
    return newMonster;
  }

  toPokemon(): PokemonObject {
    return ((pokemonList as unknown as PokemonObject[]).find((pkmn) => pkmn.Name == this.name) as PokemonObject);
  }
};