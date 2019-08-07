import typesJSON from "../info/types.json";

export class Types {
    static getWeaknessForPkmn(pkmn: Pokemon) {
        const types = [pkmn.Type1, pkmn.Type2];
        return types.map(t => {
            if(t) {
                const type = (typesJSON as PkmnTypes)[t] as PkmnType;
                return (type.Weaknesses) ? type.Weaknesses.split(",") : [];
            }
        }).flat(2);
    }
    static getStrenghForPkmn(pkmn: Pokemon) {
        const types = [pkmn.Type1, pkmn.Type2];
        return types.map(t => {
            if(t) {
                const type = (typesJSON as PkmnTypes)[t] as PkmnType;
                return (type.Resistances) ? type.Resistances.split(",") : [];
            }
        }).flat(2);
    }
    static getInmunitiesForPkmn(pkmn: Pokemon) {
        const types = [pkmn.Type1, pkmn.Type2];
        return types.map(t => {
            if(t) {
                const type = (typesJSON as PkmnTypes)[t] as PkmnType;
                return (type.Immunities) ? type.Immunities.split(",") : [];
            }
        }).flat(2);
    }
}