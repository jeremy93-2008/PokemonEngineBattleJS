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
        you: string;
        her: string;
    }
}

interface PkmnCircleProps {
    terrain: PkmnBattleTerrain,
    team: Monster[],
    trainer: string,
    humain: boolean,
    pokemonSelected: number,
    animation?: PkmnStateAnimation
}

interface PkmnStateMessage {
    ally: PokemonMessage,
    enemy: PokemonMessage,
    battle: Battle;
    setMessage:  React.Dispatch<React.SetStateAction<JSX.Element>>;
    setAlly?: React.Dispatch<React.SetStateAction<PokemonMessage>>;
    setEnemy?: React.Dispatch<React.SetStateAction<PokemonMessage>>;
    setAnimation?: React.Dispatch<React.SetStateAction<PkmnStateAnimation | undefined>>;
    pokemonRound?: PkmnRoundMessage;
    attack?: Attacks;
    human?: boolean;
}

interface PkmnStateAnimation extends AnimationProps {
    human: boolean;
    messageType?: PkmnActionMessage;
}

type dispatchAnimaton = React.Dispatch<React.SetStateAction<PkmnStateAnimation>>;

type PkmnRoundMessage = { damage: number, modifier: number, attack?: Attacks }

type PkmnActionMessage = "Attack" | "MessageAttack" | "MessageEffectiveness" | "MessageDamage" | "MessageFainted";

type PkmnBattleTerrain = "grass" | "city" | "ocean" | "mountain";