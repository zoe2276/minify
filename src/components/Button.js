import * as React from "react"

export const Button = ({text, action}) => {
    const nonceIt = Math.floor(Math.random() + 1 * 9)
    const nonceLib = "0123456789abcdefghijklmnopqrstuvwxyz".split("")
    const nonce = []
    for (let i = 0; i < nonceIt; i++) {
        nonce.push(nonceLib[Math.floor(Math.random * 36)])
    }

    return (
        <div key={nonce} className="button" onClick={action}>{text}</div>
    )
}