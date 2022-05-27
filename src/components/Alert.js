import { css, keyframes } from "@emotion/react";
import { useState, useEffect, useContext } from "react";
import { black, fadeTime, white } from "../data/constants";
import { SettingContext } from "../context/SettingContext";

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

const alertTimerId = []

export default function Alert({cAlert, alertClear}) {
    const {visibleCount, string, isClearMention} = cAlert
    const {darkMode} = useContext(SettingContext)
    const [isFadeOut, setIsFadeOut] = useState(false)

    useEffect(() => {
        if (!isFadeOut && visibleCount > alertTimerId.length) {
            let index = alertTimerId.length - 1;
            while (index >= 0) {
                clearTimeout(alertTimerId[index])
                alertTimerId.pop()
                index = alertTimerId.length - 1;
            }
            const alertTimeOut = setTimeout(() => {
                alertTimerId.length = 0
                setIsFadeOut(true)
            }, 1000);
            alertTimerId.push(alertTimeOut)
        }
    })

    useEffect(() => {
        if (isFadeOut && alertTimerId.length === 0) {
            setTimeout(() => {
                setIsFadeOut(false)
                alertClear(isClearMention)
            }, fadeTime - 100);
        }
    })

    return (
        <div css={css`
            position: absolute;
            left: 0;
            right: 0;
            top: 87.3px;
            z-index: ${(visibleCount > 0) ? 1 : -1};;
            display: flex;
            justify-content: center;
            opacity: ${(visibleCount > 0) ? 1 : 0};
            ${isFadeOut ? fadeOutAnimation : ``}
        `}>
            <div css={css`
                padding: 16px;
                background-color: ${darkMode ? white : black};
                color: ${darkMode ? black : white};
                border-radius: 5px;
                font-weight: 900;
            `}>
                {string}
            </div>
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
*/