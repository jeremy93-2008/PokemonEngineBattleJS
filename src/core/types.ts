import typesJSON from "../info/types.json";
import { PokemonObject, PkmnTypes, PkmnType } from "../pokemon-battle/typing/pkmn.def.js";

export class Types {
    static getWeaknessForPkmn(pkmn: PokemonObject) {
        const types = [pkmn.Type1, pkmn.Type2];
        return types.map(t => {
            if(t) {
                const type = (typesJSON as PkmnTypes)[t] as PkmnType;
                return (type.Weaknesses) ? type.Weaknesses.split(",") : [];
            }
        }).flat(2);
    }
    static getStrenghForPkmn(pkmn: PokemonObject) {
        const types = [pkmn.Type1, pkmn.Type2];
        return types.map(t => {
            if(t) {
                const type = (typesJSON as PkmnTypes)[t] as PkmnType;
                return (type.Resistances) ? type.Resistances.split(",") : [];
            }
        }).flat(2);
    }
    static getInmunitiesForPkmn(pkmn: PokemonObject) {
        const types = [pkmn.Type1, pkmn.Type2];
        return types.map(t => {
            if(t) {
                const type = (typesJSON as PkmnTypes)[t] as PkmnType;
                return (type.Immunities) ? type.Immunities.split(",") : [];
            }
        }).flat(2);
    }
}