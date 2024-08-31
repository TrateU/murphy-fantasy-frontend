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
    const [isOpen, setIsOpen] = useState(true);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Nav>
                <NavMenu style={{ display: isOpen ? "flex" : "none" }}>
                    <NavLink to="/scores" activeStyle>
                        Score Board
                    </NavLink>
                    <NavLink to="/matchups" activeStyle>
                        Individual Matchups
                    </NavLink>
                    <NavLink to="/standings" activeStyle>
                        Standings
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;