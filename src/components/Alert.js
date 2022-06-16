import { css, keyframes } from "@emotion/react";
import React, { useState, useEffect, useContext } from "react";
import { black, fadeTime, white } from "../data/constants";
import { SettingContext } from "../context/SettingContext";
import { AlertContext } from "../context/AlertContext";

const fadeOut = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`

const fadeOutAnimation = css`
    animation: ${fadeOut} ${fadeTime}ms;
`

export default function Alert() {
    const {cAlert} = useContext(AlertContext)

    const list = cAlert.map((cur, i) => {
        return <PersonalAlert key={i.toString() + cur} str={cur} />
    })

    return (
        <div css={css`
            position: absolute;
            left: 0;
            right: 0;
            top: 87.3px;
            z-index: ${(cAlert.length > 0) ? 1 : -1};;
            display: flex;
            justify-content: center;
            opacity: ${(cAlert.length > 0) ? 1 : 0};
        `}>
            {list}
        </div>
    )
}

function PersonalAlert({str}) {
    const {darkMode} = useContext(SettingContext)
    const [string, setString] = useState(str)
    const [isFadeOut, setIsFadeOut] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setIsFadeOut(true)
        }, 1000)
        setTimeout(() => {
            setString("")
        }, 1000 + fadeTime)
    }, [])

    return (
        <div css={css`
            display: ${string !== "" ? 'block' : 'none'};
            position: absolute;
            top: 0px;
            padding: 16px;
            background-color: ${darkMode ? white : black};
            color: ${darkMode ? black : white};
            border-radius: 5px;
            font-weight: 900;
            ${isFadeOut ? fadeOutAnimation : ``}
        `}>
            {string}
        </div>
    )
}
/*
    height: 715 = (200 + 515), bottom: 576.3 = (200 + 376.3) 515 - 376.3 = 138.7
    height: 700 = (200 + 500), bottom: 563.3 = (200 + 363.3) 500 - 363.3 = 136.7
    height: 600 = (200 + 400), bottom: 471.3 = (200 + 271.3) 400 - 271.3 = 128.7
    height: 500 = (200 + 300), bottom: 383.3 = (200 + 183.3) 300 - 183.3 = 116.7
    height: 400 = (200 + 200), bottom: 292.3 = (200 + 92.3)  200 -  92.3 = 107.7
    height: 300 = (200 + 100), bottom: 202.3 = (200 + 2.3)   100 -   2.3 = 97.7
}
*/