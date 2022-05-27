import { HiMenu } from "react-icons/hi"
import { FaRegQuestionCircle } from "react-icons/fa"
import { BiBarChartAlt2 } from "react-icons/bi"
import { IoMdSettings } from "react-icons/io"
import { css } from "@emotion/react"
import { headerHeight, headerPadding, fadeTime, NOTOPEN, GUIDE, STATISTICS, SETTING, lightGray, darkColorTone, keyboardMaxWidth } from "../data/constants"
import Statistics from "./Statistics"
import React, { useEffect, useState, useRef, useContext } from "react"
import BlurBackground from "./BlurBackground"
import Guide from "./Guide"
import Setting from "./Setting"
import { SettingContext } from "../context/SettingContext"
import { WindowContext } from "../context/WindowContext"

const head = css`
    min-width: 230px;
    height: ${headerHeight}px;
    padding-left: ${2 * headerPadding}px;
    padding-right: ${2 * headerPadding}px;

    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const iconLayout = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 12px;
`

const title = (popMenu) => {
    switch(popMenu) {
        case GUIDE: return "HOW TO PLAY";
        case STATISTICS: return "STATISTICS";
        case SETTING: return "SETTING";
        default: return "";
    }
}

export default function Header({popMenu, onPopMenu}) {
    const {width} = useContext(WindowContext)
    const {darkMode} = useContext(SettingContext)
    const [isFadeOut, setIsFadeOut] = useState(false)
    const [cHeight, setCHeight] = useState(0)
    const viewEl = useRef(null)

    const contentWidth = (width / 1.12 > keyboardMaxWidth) ? keyboardMaxWidth : width / 1.12

    const view = (popMenu) => {
        switch(popMenu) {
            case GUIDE: return <Guide />;
            case STATISTICS: return <Statistics parentWidth={contentWidth} />;
            case SETTING: return <Setting />;
            default: return <div></div>;
        }
    }

    useEffect(() => {
        setCHeight(viewEl.current.clientHeight)
    }, [popMenu])

    const onInvisible = () => {
        if (!isFadeOut) {
            setIsFadeOut(true)
            setTimeout(() => {
                onPopMenu(NOTOPEN)
                setIsFadeOut(false)
            }, fadeTime - 100);
        }
    }

    const borderBottom = css`
        border-bottom: 1px solid ${(darkMode) ? darkColorTone[3] : lightGray};
    `

    return (
        <>
            <BlurBackground isVisible={(popMenu > NOTOPEN)} onInvisible={onInvisible} isFadeOut={isFadeOut} contentWidth={contentWidth} contentHeight={cHeight} title={title(popMenu)}>
                <div ref={viewEl}>
                    {view(popMenu)}
                </div>
            </BlurBackground>
            <header css={[head, borderBottom]}>
                <span css={iconLayout}>
                    <HiMenu css={css`
                        margin-top: -1px;
                        margin-left: -4px;
                    `} size={28} />
                    <FaRegQuestionCircle css={css`
                        margin-top: 2px;
                        cursor: pointer;
                    `} size={22} onClick={() => onPopMenu(GUIDE)} />
                </span>
                <span css={css`
                    font: 37px 'nyt-karnakcondensed';
                `}><strong>Wordle</strong></span>
                <div css={[iconLayout, css`
                    margin-bottom: 2px;
                `]}>
                    <BiBarChartAlt2 css={css`
                        transform: rotateY(180deg);
                        cursor: pointer;
                    `} size={23} onClick={() => onPopMenu(STATISTICS)} />
                    <IoMdSettings css={css`
                        cursor: pointer;
                    `}size={23} onClick={() => onPopMenu(SETTING)}/>
                </div>
            </header>
        </>
    )
}