import React from 'react'
import { Button } from '../index'
export const Refresh = ({ setLoggedIn }) => {
    const handleClick = () => {
        window.localStorage.clear();
        window.location.href = "http://localhost:3000"
        setLoggedIn(false);
    }
    return <Button text='Refresh' action={handleClick} />
}