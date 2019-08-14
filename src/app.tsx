import React from "react";
import ReactDom from "react-dom";
import { Switch, Redirect } from "react-router";
import { HashRouter, Route } from "react-router-dom";
import { PokemonChoose } from "./pokemon-battle/pkmn-choose";
import { PokemonBattle } from "./pokemon-battle/pkmn-battle";

ReactDom.render(
<HashRouter hashType="slash">
    <Switch>
        <Route exact path="/" component={PokemonChoose}></Route>
        <Route path="/battle" render={(props) => {
            if(props.location.state) 
                return <PokemonBattle {...props} ></PokemonBattle>
            return <Redirect to="/"></Redirect>
        }}></Route>        
    </Switch>
</HashRouter>, document.getElementById("app"));
