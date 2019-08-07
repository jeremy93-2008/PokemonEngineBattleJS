import movesJSON from "../info/moves.json";
import uniqueRandom from "unique-random";
import Attacks from "./attack";

export class pkmnAttacks {

    static getRandomAttacksObjectForPkmn(pkmn: Pokemon, level?: number) {
        const moves = this.getRandomAttacks(pkmn, level);
        return moves.map(m => {
            return new Attacks(m.name, Number(m.power), m.type, Number(m.accuracy), m.kind, "");
        })
    }

    static getRandomAttacks(pkmn: Pokemon, level?: number) {
        const moves = this.getAvailablePkmnMoves(pkmn, level) as Moves;
        const movesExtended = this.getAttackData(moves);
        const random = uniqueRandom(0, movesExtended.length - 1);
        return [movesExtended[random()], movesExtended[random()], movesExtended[random()], movesExtended[random()]]
    }

    static getAttackData(moves: Moves) {
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

    static getAvailablePkmnMoves(pkmn: Pokemon, level?: number) {
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