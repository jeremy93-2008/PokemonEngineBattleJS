import Monster from "../../core/monster";
import { PokemonMessage } from "./pkmn.def";
import { Battle } from "../../core/battle";
import Attacks from "../../core/attack";

interface PkmnBattleProps {
    terrain: PkmnBattleTerrain;
    pkmns: {
        you: Monster[],
        her: Monster[]
    },
    trainers: {
        you: PkmnTrainerProps;
        her: PkmnTrainerProps;
    }
}

interface PkmnTrainerProps {
    name: string;
    sprite: string;
}

interface PkmnMessage {
    render: JSX.Element;
    action: PkmnActionMessage;
    state: PkmnStateMessage | undefined;
}

interface PkmnCircleProps {
    terrain: PkmnBattleTerrain,
    team: Monster[],
    trainer: PkmnTrainerProps,
    humain: boolean,
    pokemonSelected: number,
    animation?: PkmnStateAnimation,
    beginBattle: boolean,
    action: PkmnActionMessage,
    isHumanTurn: boolean
}

interface PkmnStateMessage {
    ally: PokemonMessage,
    enemy: PokemonMessage,
    battle: Battle;
    setMessage:  React.Dispatch<React.SetStateAction<PkmnMessage>>;
    setAlly?: React.Dispatch<React.SetStateAction<PokemonMessage>>;
    setEnemy?: React.Dispatch<React.SetStateAction<PokemonMessage>>;
    setAnimation?: React.Dispatch<React.SetStateAction<PkmnStateAnimation | undefined>>;
    pokemonRound?: PkmnRoundMessage;
    attack?: Attacks;
    human?: boolean;
    pkmnStrategicChange?: boolean;
    pkmnRoundChange?: boolean;
    beginBattle?: boolean;
    hurtItself?: boolean;
}

interface PkmnStateAnimation extends AnimationProps {
    human: boolean;
    messageType?: PkmnActionMessage;
}

type dispatchAnimaton = React.Dispatch<React.SetStateAction<PkmnStateAnimation>>;

type PkmnRoundMessage = { damage: number, modifier: number, attack?: Attacks }

type PkmnActionMessage = "Attack" | "PokemonList" | "MessageAttack" | "MessageEffectiveness" | "MessageStart" |
                        "MessageDamage" | "MessageFainted" | "MessagePokemonChanging" | "MessagePokemonChanged" | 
                        "MessageUnableStatus" | undefined | null;

type PkmnBattleTerrain = "grass" | "city" | "ocean" | "mountain";