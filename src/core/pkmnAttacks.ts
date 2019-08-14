import movesJSON from "../info/moves.json";
import uniqueRandom from "unique-random";
import Attacks from "./attack";
import { PokemonObject, Moves, PkmnMoves } from "../pokemon-battle/typing/pkmn.def.js";

export class pkmnAttacks {

    static getRandomAttacksObjectForPkmn(pkmn: PokemonObject, level?: number) {
        const moves = this.getRandomAttacks(pkmn, level);
        return moves.map(m => {
            return new Attacks(m.name, Number(m.power), m.type, Number(m.accuracy), m.kind, "");
        })
    }

    private static getRandomAttacks(pkmn: PokemonObject, level?: number) {
        const moves = this.getAvailablePkmnMoves(pkmn, level) as Moves;
        const movesExtended = this.getAttackData(moves);
        const random = uniqueRandom(0, movesExtended.length - 1);
        return [movesExtended[random()], movesExtended[random()], movesExtended[random()], movesExtended[random()]]
    }

    private static getAttackData(moves: Moves) {
        return moves.map(m => {
            const arrayMoveExt = (movesJSON as PkmnMoves)[m.attackName.toUpperCase()];
            return {
                name: arrayMoveExt[2],
                description: arrayMoveExt[13],
                power: arrayMoveExt[4],
                accuracy: arrayMoveExt[7],
                priority: arrayMoveExt[11],
                type: arrayMoveExt[5],
                kind: arrayMoveExt[6]
            }
        })
    }

    private static getAvailablePkmnMoves(pkmn: PokemonObject, level?: number) {
        return pkmn.Moves.split(",").map((m, i)=> {
            if(isNaN(m as unknown as number)) {
                return {
                    level: Number(pkmn.Moves.split(",")[i - 1]),
                    attackName: m 
                }
            }
        }).map(m => (m && m.level <= (level ? level : 100)) ? m : null).filter(m => m);
    }
}