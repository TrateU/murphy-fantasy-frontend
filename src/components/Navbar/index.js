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
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Nav>
                <Bars onClick={toggleMenu} />
                <NavMenu style={{ display: isOpen ? "flex" : "none" }}>
                    <NavLink to="/" onClick={() => setIsOpen(false)}>
                        Home
                    </NavLink>
                    <NavLink to="/scores" activeStyle onClick={() => setIsOpen(false)}>
                        Score Board
                    </NavLink>
                    <NavLink to="/matchups" activeStyle onClick={() => setIsOpen(false)}>
                        Individual Matchups
                    </NavLink>
                    <NavLink to="/standings" activeStyle onClick={() => setIsOpen(false)}>
                        Standings
                    </NavLink>
                    <NavLink to="/teams" activeStyle onClick={() => setIsOpen(false)}>
                        Teams
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;