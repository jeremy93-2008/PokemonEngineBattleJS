/**
 * Pokemon object as Stored in our JSON data
 */
interface Pokemon {
    Name: string,
    InternalName: string,
    Type1: string,
    Type2: string,
    BaseStats: string,
    GenderRate: string,
    GrowthRate: string,
    BaseEXP: number,
    EffortPoints: number[],
    Rareness: number,
    Happiness: number,
    Abilities: string,
    HiddenAbility: string,
    Moves: string,
    EggMoves: string[],
    Compatibility: string[],
    StepsToHatch: number,
    Height: number,
    Weight: number,
    Color: string,
    Habitat: string,
    RegionalNumbers: number,
    Kind: string,
    Pokedex: string,
    BattlerPlayerY: number,
    BattlerEnemyY: number,
    BattlerAltitude: number,
    Evolutions: (string | number)[]
}

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