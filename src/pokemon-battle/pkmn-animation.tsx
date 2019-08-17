import animations from "../assets/animation/*.png"
import { PkmnStateAnimation, PkmnActionMessage, dispatchAnimaton } from "./typing/pkmn-battle";

const commonAnimationAttack : PkmnStateAnimation = {
    image: animations["anim1"],
    count: 5,
    time: 350,
    splitBy: 5,
    human: false
}

export function dispatchAnimation(action: PkmnActionMessage, isHuman: boolean, setAnimation: dispatchAnimaton) {
    setAnimation({...commonAnimationAttack, messageType: action, human: isHuman});
}