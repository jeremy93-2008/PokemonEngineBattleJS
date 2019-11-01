import Monster from "../../core/monster";
import { PkmnTrainerProps } from "./pkmn-battle";
import Attacks from "../../core/attack";

/**
 * Pokemon object as Stored in our JSON data
 */
interface PokemonObject {
    Name: string,
    InternalName: string,
    Type1: string,
    Type2?: string,
    BaseStats: string,
    GenderRate: string,
    GrowthRate: string,
    BaseEXP: string,
    EffortPoints: string,
    Rareness: string,
    Happiness: string,
    Abilities: string,
    HiddenAbility?: string,
    Moves: string,
    EggMoves?: string,
    Compatibility: string,
    StepsToHatch: string,
    Height: string,
    Weight: string,
    Color: string,
    Habitat: string,
    RegionalNumbers: string,
    Kind: string,
    Pokedex: string,
    BattlerPlayerY: string,
    BattlerEnemyY: string,
    BattlerAltitude: string,
    Evolutions: string
}

interface pkmnStats {
    hp: number;
    att: number,
    matt: number,
    def: number,
    mdef: number,
    speed: number
}

interface PkmnStatusChange {
    effect?: PkmnEffect;
    turnEffect?: number | number[];
    allyStat?: pkmnStats | "reset";
    enemyStat?: pkmnStats | "reset";
    whenSleeping?: boolean;
    timeOfAttack?: boolean;
}

interface PkmnCurrentStatus extends PkmnStatusChange {
    turnEffect?: number;
}

type PkmnEffect = "poisoned" | "paralysis" | "burned" | "frozen" | "sleep" | "confused" | "flinch" | "normal";

interface PkmnMoves {
    [x: string]: string[];
}

type Moves = {
    level: number;
    attackName: string;
}[]

interface PkmnTypes {
    [x: string]: PkmnType;
}

interface PkmnType {
    Name: string,
    InternalName: string,
    IsSpecialType?: string,
    Resistances?: string,
    Weaknesses?: string,
    Immunities?: string
} 

interface PokemonMessage { 
    team: Monster[]; 
    trainer: PkmnTrainerProps; 
}

interface PkmnBattleReturn {
    damage: number;
    modifier: number;
    attack: Attacks;
    unableToAttack: boolean;
    attackEvaded: boolean;
}

/**
 *  "Name": "Bulbasaur",
    "InternalName": "BULBASAUR",
    "Type1": "GRASS",
    "Type2": "POISON",
    "BaseStats": "45,49,49,45,65,65",
    "GenderRate": "FemaleOneEighth",
    "GrowthRate": "Parabolic",
    "BaseEXP": "64",
    "EffortPoints": "0,0,0,0,1,0",
    "Rareness": "45",
    "Happiness": "70",
    "Abilities": "OVERGROW",
    "HiddenAbility": "CHLOROPHYLL",
    "Moves": "1,TACKLE,3,GROWL,7,LEECHSEED,9,VINEWHIP,13,POISONPOWDER,13,SLEEPPOWDER,15,TAKEDOWN,19,RAZORLEAF,21,SWEETSCENT,25,GROWTH,27,DOUBLEEDGE,31,WORRYSEED,33,SYNTHESIS,37,SEEDBOMB",
    "EggMoves": "AMNESIA,CHARM,CURSE,ENDURE,GIGADRAIN,GRASSWHISTLE,INGRAIN,LEAFSTORM,MAGICALLEAF,NATUREPOWER,PETALDANCE,POWERWHIP,SKULLBASH,SLUDGE",
    "Compatibility": "Monster,Grass",
    "StepsToHatch": "5355",
    "Height": "0.7",
    "Weight": "6.9",
    "Color": "Green",
    "Habitat": "Grassland",
    "RegionalNumbers": "1,231",
    "Kind": "Semilla",
    "Pokedex": "A Bulbasaur es fácil verle echándose una siesta al sol. La semilla que tiene en el lomo va creciendo cada vez más a medida que absorbe los rayos del sol.",
    "BattlerPlayerY": "0",
    "BattlerEnemyY": "25",
    "BattlerAltitude": "0",
    "Evolutions": "IVYSAUR,Level,16"
 */