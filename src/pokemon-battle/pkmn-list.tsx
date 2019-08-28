import React from "react";
import images from "../assets/normal/*.png";

import { PokemonObject } from "./typing/pkmn.def";
import { PokemonListProps } from "./typing/pkmn-list.js";
import Monster from "../core/monster.js";

export function PokemonList(props: PokemonListProps) {
    const pkmnList = props.pkmns;
    if((props.pkmns[0] as PokemonObject).Name) {
        return (<div className={`pokemon-list ${props.className}`}>
            {(pkmnList as PokemonObject[]).map((pkmn, i) => {
                const image = images[pkmn.Name];
                const isDisabled = (props.disabled) ? props.disabled.filter(d => d.Name == pkmn.Name).length > 0 : false;
                return <button onClick={() => {
                    props.onClick(pkmn)
                }} key={i} 
                className={`pokemon-one ${props.classForCell} ${isDisabled ? "disable" : ""}`}><img src={image}></img><br />{pkmn.Name}</button>
            })}
        </div>);        
    } else {
        return (<div className={`pokemon-list ${props.className}`}>
            {(pkmnList as Monster[]).map((pkmn, i) => {
                const image = images[pkmn.name];
                const isDisabled = (props.disabled) ? props.disabled.filter(d => d.Name == pkmn.name).length > 0 : false;
                const percentage = pkmn.stats.hp * 100 / pkmn.maxHP;
                return <button onClick={() => {
                    props.onClick(pkmn)
                }} key={i} 
                className={`pokemon-one ${props.classForCell} ${isDisabled ? "disable" : ""}`}>
                    <img src={image}></img>
                    <br />
                    {pkmn.name}
                    {props.details && props.details.hp && <div className="hp-container">
                        <div style={{width: percentage + "%", backgroundColor: percentage < 20 ? "red" : percentage < 40 ? "orange" : "green"}} className="hp-value"></div>
                    </div>}
                </button>
            })}
        </div>);         
    }

}