import { PokemonObject } from "./pkmn.def";
import Monster from "../../core/monster";

interface PokemonListProps {
    pkmns: PokemonObject[] | Monster[];
    onClick: (pkmn: PokemonObject | Monster, index: number) => void;
    className?: string;
    classForCell?: string;
    disabled?: PokemonObject[],
    details?: PokemonListDetails;
}

interface PokemonListDetails {
    hp: boolean;
    exp?: boolean;
}