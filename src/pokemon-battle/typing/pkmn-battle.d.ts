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

interface PkmnCircleProps {
    battle: Battle;
    message: string;
}

interface PkmnCircleOneProps {
    team: Monster[];
    messageKey: string;
    battle: Battle;
    currentPkmn: Monster;
    human: boolean;
}

type setMessagePkmn = React.Dispatch<React.SetStateAction<JSX.Element>>;
type setBattlePkmn = React.Dispatch<React.SetStateAction<{
    battle: Battle,
    message: string
}>>;

interface PkmnStateMessage {
    ally: PokemonMessage,
    enemy: PokemonMessage,
    battle: Battle;
    setAlly?: React.Dispatch<React.SetStateAction<PokemonMessage>>;
    setEnemy?: React.Dispatch<React.SetStateAction<PokemonMessage>>;
    pokemonRound?: PkmnRoundMessage;
    attack?: Attacks;
    human?: boolean;
    pkmnStrategicChange?: boolean;
    pkmnRoundChange?: boolean;
    beginBattle?: boolean;
}

type PkmnRoundMessage = { damage: number, modifier: number, attack?: Attacks }

type PkmnBattleTerrain = "grass" | "city" | "ocean" | "mountain";

interface PkmnBattleContainer {
    pkmns: PkmnsAllTeams,
    trainers: PkmnTrainers,
    setMessage: setMessagePkmn,
    setBattle: setBattlePkmn
}

type pkmnBattleList = {key: string, battle: Battle};