import React, { useState } from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./navbarElements";

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu style={{ "flex" : "none" }}>
                    <NavLink to="/">
                        Home
                    </NavLink>
                    <NavLink to="/scores" activeStyle>
                        Score Board
                    </NavLink>
                    <NavLink to="/matchups" activeStyle>
                        Individual Matchups
                    </NavLink>
                    <NavLink to="/standings" activeStyle>
                        Standings
                    </NavLink>
                    <NavLink to="/teams" activeStyle>
                        Teams
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;