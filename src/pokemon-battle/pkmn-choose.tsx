import React, { useState } from "react";

import Monster from "../core/monster";

import logo from "../assets/logo.png";
import pkmnImage from "../assets/pokeball.png";
import images from "../assets/normal/*.png";

import pokemonList from "../info/pokemon.json";

import "./style/pkmn-choose.css";
import { Types } from "../core/types";
import { pkmnAttacks } from "../core/pkmnAttacks";
import { Link } from "react-router-dom";
import uniqueRandom from "unique-random";

export function Pokemon() {
    const [pokemonChosen, setPokemonChosen] = useState<Monster[] | null[]>([null, null, null, null, null, null]);
    const [index, setIndex] = useState(0);
    const [teamComplete, setTeamComplete] = useState(false);

    const pkmnList = pokemonList as Pokemon[];
    return (<div className="container">
        <img className="logo" src={logo}></img>
        <div className={`pokemon-chosen-container ${teamComplete ? "complete" : ""}`}>
            {(pokemonChosen as Monster[]).map((pkmn, i) => {
                if(pkmn) return (
                    <div key={i} data-index={i} onClick={()=> {
                        setIndex(i);
                    }} className={`pokemon-chosen ${i == index ? "active" : ""}`}>
                        <img className="pokeball-pokemon" src={images[pkmn.name]}></img>
                        <br />{pkmn.name}
                    </div>)
                
                return (
                    <div key={i} data-index={i}  onClick={()=> {
                        setIndex(i);
                    }} className={`pokemon-chosen ${i == index ? "active" : ""}`}>
                        <img className="pokeball" src={pkmnImage}></img>
                    </div>)
            })}
        </div>
        {teamComplete && <Link to={{
                                        pathname: "/battle",
                                        state: {
                                            terrain: "grass",
                                            pkmns: {
                                                you: pokemonChosen,
                                                her: PokemonTeamForEnemy(pkmnList)
                                            },
                                            trainers : {
                                                you: "",
                                                her: ""
                                            }
                                        }
                                    }} className="fight">Fight!</Link>}
        <h3>Choose a Pokemon</h3>
        <div className="pokemon-list">
            {pkmnList.map((pkmn, i) => {
                const image = images[pkmn.Name];
                return <button onClick={addPokemon(pkmn, pokemonChosen, index, setTeamComplete, setIndex, setPokemonChosen)} key={i} className="pokemon-one"><img src={image}></img><br />{pkmn.Name}</button>
            })}
        </div>
    </div>);
}

function addPokemon(pkmn: Pokemon, pokemonChosen: Monster[] | null[], index: number, setTeamComplete: React.Dispatch<React.SetStateAction<boolean>>, setIndex: React.Dispatch<React.SetStateAction<number>>, setPokemonChosen: React.Dispatch<React.SetStateAction<Monster[] | null[]>>): ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined {
    return () => {
        const base = pkmn.BaseStats.split(",");
        const monster = new Monster(pkmn.Name, {
            hp: Number(base[0]),
            att: Number(base[1]),
            def: Number(base[2]),
            matt: Number(base[3]),
            mdef: Number(base[4]),
            speed: Number(base[5])
        }, pkmnAttacks.getRandomAttacksObjectForPkmn(pkmn, 50), [pkmn.Type1, pkmn.Type2], Types.getWeaknessForPkmn(pkmn), Types.getStrenghForPkmn(pkmn), false, Types.getInmunitiesForPkmn(pkmn), 50);

        // We verify that we not selecting the same pokemon again
        if(!!(pokemonChosen as Monster[]).find(pkmn => (pkmn) ? pkmn.name == monster.name : true)) return;
        
        // We add the Pokemon selected into the team array
        const pokemonChosenUpdate = (pokemonChosen as Monster[]).map((pkmn, i) => (i == index) ? monster : pkmn);
        (pokemonChosenUpdate.filter((pkmn) => !pkmn).length == 0) ? setTeamComplete(true) : setTeamComplete(false);

        // We update value
        setIndex(index + 1);
        setPokemonChosen(pokemonChosenUpdate);
    };
}

function PokemonTeamForEnemy(pkmns: Pokemon[]): Monster[] {
     const unique = uniqueRandom(0, pkmns.length - 1);
     const pokemonEnemy =  [pkmns[unique()], pkmns[unique()], pkmns[unique()], pkmns[unique()], pkmns[unique()], pkmns[unique()]];
     return pokemonEnemy.map(pkmn => {
        const base = pkmn.BaseStats.split(",");

        return new Monster(pkmn.Name, {
            hp: Number(base[0]),
            att: Number(base[1]),
            def: Number(base[2]),
            matt: Number(base[3]),
            mdef: Number(base[4]),
            speed: Number(base[5])
        }, pkmnAttacks.getRandomAttacksObjectForPkmn(pkmn, 50), [pkmn.Type1, pkmn.Type2], Types.getWeaknessForPkmn(pkmn), Types.getStrenghForPkmn(pkmn), false, Types.getInmunitiesForPkmn(pkmn), 50);
     });
}