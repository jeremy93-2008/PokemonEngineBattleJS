import Monster from "../../core/monster";
import { PokemonMessage } from "./pkmn.def";
import { Battle } from "../../core/battle";
import Attacks from "../../core/attack";

interface PkmnBattleProps {
    terrain: PkmnBattleTerrain;
    pkmns: PkmnsAllTeams,
    trainers: PkmnTrainers
}

interface PkmnTrainers {
    you: PkmnTrainerProps;
    her: PkmnTrainerProps;
}
interface PkmnsAllTeams {
    you: Monster[],
    her: Monster[]
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
    team: Monster[],
    trainer: PkmnTrainerProps,
    humain: boolean,
    pokemonSelected: number,
    animation: PkmnStateAnimation,
    state: PkmnStateMessage
}

type setMessagePkmn = React.Dispatch<React.SetStateAction<JSX.Element>>;

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

interface PkmnBattleContainer {
    pkmns: PkmnsAllTeams,
    trainers: PkmnTrainers,
    setMessage: setMessagePkmn
}
