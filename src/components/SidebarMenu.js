import React from 'react';
import { Button, Refresh } from "../index";
import img_menu from '../graphics/menu.png';
import img_menu_active from "../graphics/menu-active.png";

export const SidebarMenu = ({ currentPage, setCurrentPage, loggedIn, setLoggedIn }) => {
    const [menuImg, setMenuImg] = React.useState(img_menu);

    const menuButtonImg = <img id='img-menu-button' alt='Menu' src={menuImg} width={32} height={32} />;

    const handleMenuImg = () => {
        document.getElementById('sidebar-menu').classList.contains('show-sidebar') ?
            (menuImg !== img_menu_active) && setMenuImg(img_menu_active) :
            (menuImg !== img_menu) && setMenuImg(img_menu);
    }

    const toggleMenu = () => {
        document.getElementById('sidebar-menu').classList.toggle('show-sidebar');

        let targetElem;
        if (currentPage === 'player') targetElem = document.getElementById('playback-wrapper');
        else if (currentPage === 'settings') targetElem = document.getElementById('settings-menu-container');
        // else if (currentPage === 'login') targetElem = document.getElementById('');
        targetElem && targetElem.classList.toggle('shifted');

        handleMenuImg();
    }

    const closeMenu = e => {
        // console.debug(e);
        if (e.target.matches('div#root') || (
            !e.target.matches('.sidebar-menu') &&
            !e.target.parentElement.matches('#sidebar-menu') &&
            (e.target.nextElementSibling && !e.target.nextElementSibling.matches('#sidebar-menu'))
            )
        ) {
            const menus = document.getElementsByClassName('sidebar-menu');
            for (let openMenu of menus) {
                if (openMenu.classList.contains('show-sidebar')) {
                    openMenu.classList.remove('show-sidebar');
                }
            }
            const sidebarCont = document.getElementById('menu-button');
            if (sidebarCont.classList.contains('active')) sidebarCont.classList.remove('active');
            if (sidebarCont.firstElementChild.classList.contains('active')) sidebarCont.firstElementChild.classList.remove('active');

            handleMenuImg();
        }
    }

    window.onclick = e => closeMenu(e);

    return(
        <>
        <div id='sidebar-menu-container'>
            <Button text={menuButtonImg} id='menu-button' action={() => {toggleMenu()}} />
            <div id='sidebar-menu' className='sidebar-menu'>
                {loggedIn &&
                    <>
                        <div id='player-router'><Button text='Player' action={() => {setCurrentPage('player')}} /></div>
                        <div id='settings-router'><Button text='Settings' action={() => {setCurrentPage('settings')}} /></div>
                    </>
                }
                <div id="refresh-wrapper"><Refresh setLoggedIn={setLoggedIn} /></div>
            </div>
        </div>
        </>
    )
}