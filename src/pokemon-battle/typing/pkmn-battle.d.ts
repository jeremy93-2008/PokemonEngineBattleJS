import Monster from "../../core/monster";

interface PkmnBattleProps {
    terrain: PkmnBattleTerrain;
    pkmns: {
        you: Monster[],
        her: Monster[]
    },
    trainers: {
        you: string;
        her: string;
    }
}

interface PkmnCircleProps {
    terrain: PkmnBattleTerrain,
    pkmns: Monster[],
    trainer: string,
    humain: boolean;
}

type PkmnBattleTerrain = "grass" | "city" | "ocean" | "mountain";