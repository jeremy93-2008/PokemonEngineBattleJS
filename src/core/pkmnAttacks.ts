import movesJSON from "../info/moves.json";
import sampleSize from "lodash.samplesize";
import Attacks from "./attack";
import { PokemonObject, Moves, PkmnMoves, PkmnStatusChange } from "../pokemon-battle/typing/pkmn.def.js";

export class pkmnAttacks {
    static getRamdomAttacksPokemon(pkmn: PokemonObject, level?: number, aggressive?: boolean) {
        const moves = this.getRandomAttacks(pkmn, level, aggressive);
        return moves.map(m => {
            return new Attacks(m.name, Number(m.power), m.type, Number(m.accuracy), m.kind, "", m.status, Number(m.accuracyStatus));
        })
    }

    private static getRandomAttacks(pkmn: PokemonObject, level?: number, aggressive?: boolean) {
        const moves = this.getAvailablePkmnMoves(pkmn, level) as Moves;
        const movesExtended = this.getAttackData(moves, aggressive);
        const moveExtendedUnique = movesExtended.filter((m) => movesExtended.filter((mm) => mm.name == m.name).length == 1);
        return sampleSize(moveExtendedUnique, 4)
    }

    private static getAttackData(moves: Moves, aggressive?: boolean) {
        return moves.map(m => {
            const arrayMoveExt = (movesJSON as PkmnMoves)[m.attackName.toUpperCase()];
            return {
                name: arrayMoveExt[2],
                description: arrayMoveExt[13],
                power: arrayMoveExt[4],
                accuracy: arrayMoveExt[7],
                priority: arrayMoveExt[11],
                type: arrayMoveExt[5],
                kind: arrayMoveExt[6],
                status: arrayMoveExt[3] as unknown as PkmnStatusChange,
                accuracyStatus: arrayMoveExt[9]
            }
        }).filter((m) => (aggressive) ? m.kind != "Status" : m);
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