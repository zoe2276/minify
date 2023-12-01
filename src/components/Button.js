import * as React from "react"

export const Button = ({text, id = undefined, action}) => {
    const nonceIt = Math.floor(Math.random() + 1 * 9)
    const nonceLib = "0123456789abcdefghijklmnopqrstuvwxyz".split("")
    const nonce = []
    for (let i = 0; i < nonceIt; i++) {
        nonce.push(nonceLib[Math.floor(Math.random * 36)])
    }

    const children = document.getElementById(id);
    if (children) for (let c of document.getElementById(id).children) {c.addEventListener('mouseup', () => action())}

    if (id === undefined) return <div key={nonce} className="button" onClick={action}>{text}</div>
    else return <div key={nonce} id={id} className="button" onClick={action}>{text}</div>
}