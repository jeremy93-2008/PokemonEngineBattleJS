import Attacks from "./attack";
import Monster from "./monster";
import { Types } from "./types";

/**
 * This file will be for the IA system of computer controled trainers.
 * The Random value will be between 0 and 1.
 * Each attack have the same amount of probability to come out, (0) 0.25 / 0.5 / 0.75 / 1
 * But each attack that are effective against the human pokemon will earn 0.3, 
 * adding 0.2 to the current one.
 * (0) 0.45 / 0.5 / 0.75 / 1.
 * Elsewhere if a attack is not effective or the human Pokemon, the Attack lose 0.2.
 * (0) -0.1 / 0.65 / 0.75 / 1.
 * But if a attack will be inmune by the human Pokemon, this Attack lose 0.5.
 * (0) 0.25 / 0 / 0.75 / 1 
 * Finally attacks with Status are slighty encouraged adding 0.05 to any attack with Status Kind, but only if the human pokemon is not already affected by a status.
 */
export function getComputerAttack(moves: Attacks[], pkmnAlly: Monster): Attacks {
    const randomValue = Math.random();
    return moves.filter((move, i) => {
        let maxAttackVariant = 0.25 * (i + 1);
        if(Types.getWeaknessForPkmn(pkmnAlly.toPokemon()).find((type) => type == move.attType)) {
            maxAttackVariant += 0.2;
        } else if(Types.getStrenghForPkmn(pkmnAlly.toPokemon()).find((type) => type == move.attType)) {
            maxAttackVariant -= 0.2;
        } else if(Types.getInmunitiesForPkmn(pkmnAlly.toPokemon()).find((type) => type == move.attType)) {
            maxAttackVariant -= 0.5;
        }
        return randomValue < maxAttackVariant;
    })[0];
}

export function getComputerPokemon(team: Monster[], pkmnAlly: Monster) {
    const randomValue = Math.random();
    const pokemon = team.filter(pkmn => pkmn.stats.hp > 0).filter((pkmn, i, arr) => {
        let maxPokemonVariant = (1 / arr.length) * (i + 1);
        if(pkmnAlly.weakness.find((type) => pkmn.typing.filter(t => t == type).length > 0)) {
            maxPokemonVariant += 0.33;
        } else if(pkmnAlly.strength.find((type) => pkmn.typing.filter(t => t == type).length > 0)) {
            maxPokemonVariant -= 0.33
        } else if(pkmnAlly.inmunities.find((type) => pkmn.typing.filter(t => t == type).length > 0)) {
            maxPokemonVariant -= 0.66
        }
        return randomValue < maxPokemonVariant;
    })[0];
    const index = team.map((pkmn, i) => (pkmn.name == pokemon.name) ? i : -1).find(index => index > -1);
    return {pokemon, index}
}