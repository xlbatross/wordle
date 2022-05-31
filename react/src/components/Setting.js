import { css } from "@emotion/react"
import React, { useContext } from "react"
import { black, darkColorTone, green, lightColorTone, lightGray, orange, white } from "../data/constants"
import { SettingContext } from "../context/SettingContext"

const switchCss = css`
    position: relative;
    display: inline-block;
    width: 35px;
    height: 21px;
    flex-shrink: 0;
`

const slider = css`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 17px;
    background-color: ${lightColorTone[2]};
    transition: 200ms;

    &:before {
        position: absolute;
        content: "";
        height: 17px;
        width: 17px;
        border-radius: 50%;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 200ms;
    }
`

export default function Setting() {
    const {darkMode, hardMode, highContrastMode, onDark, onHard, onContrast} = useContext(SettingContext)
    return (
        <>
            <ToggleLine title={"Hard Mode"} description={"Any revealed hints must be used in subsequent guesses"} mode={hardMode} onChange={onHard} />
            <ToggleLine title={"Dark Mode"} mode={darkMode} onChange={onDark} />
            <ToggleLine title={"High Contrast Mode"} description={"For improved color vision"} mode={highContrastMode} onChange={onContrast} />
            <LinkLine title={"Feedback"} link={"mailto:fourze4ex@gmail.com"} linkName={"Email"} hoverName={"fourze4ex@gmail.com"}/>
            <LinkLine title={"Community"} link={"https://twitter.com/NYTGames"} linkName={"Twitter"} hoverName={"@NYTGames"} />
            <LinkLine title={"Question?"} link={"https://help.nytimes.com/hc/en-us/articles/360029050872-Word-Games-and-Logic-Puzzles#h_01FVGCB2Z00ZQMDMCYWBPWJNXB"} linkName={"FAQ"} />
        </>
    )
}

function BaseLine({children, title, description}) {
    const {darkMode} = useContext(SettingContext)
    return (
        <div css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
            padding: 0px 16px;
            border-bottom: 1px solid ${darkMode ? darkColorTone[2] : lightGray};
        `}>
            <div>
                <div css={css`
                    text-align: left;
                    font-size: 18px;
                    color: ${darkMode ? white : black}
                `}>{title}</div>
                <div css={css`
                    text-align: left;
                    font-size: 13px;
                    color: ${lightColorTone[2]};
                    display: ${description ? 'block' : 'none'};
                `}>{description}</div>
            </div>
            {children}
        </div>
    )
}

function ToggleLine({title, description, mode, onChange}) {
    const {highContrastMode} = useContext(SettingContext)
    const contrastColor = highContrastMode ? orange : green
    const input = css`
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .${'css-' + slider.name} {
            background-color: ${contrastColor};
        }

        &:focus + .${'css-' + slider.name} {
            box-shadow: 0 0 1px #2196F3;
        }

        &:checked + .${'css-' + slider.name}:before {
            transform: translateX(14px);
        }
    `
    return (
        <BaseLine title={title} description={description}>
            <label css={switchCss}>
                <input type="checkbox" css={input} checked={mode} onChange={onChange}/>
                <span css={slider}></span>
            </label>
        </BaseLine>
    )
}

function LinkLine({title, description, link, linkName, hoverName}) {
    return (
        <BaseLine title={title} description={description}>
            <a css={css`
                color: ${lightColorTone[2]};
            `} href={link} title={hoverName}>{linkName}</a>
        </BaseLine>
    )
}