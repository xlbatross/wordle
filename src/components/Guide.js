import { css } from "@emotion/react"
import React, { useContext } from "react"
import { contentGap, darkColorTone, EXIST, INIT, JUST, lightGray, NONE } from "../data/constants"
import { SettingContext } from "../context/SettingContext"
import LetterBox from "./LetterBox"

const lineLayout = css`
    padding: 0px 16px 15px 16px;
    text-align: left;
    font-size: 14px;
`

const lineLayout2 = css`
    padding: 16px 16px 15px 16px;
    text-align: left;
    font-size: 14px;
`

const exampleWords = [
    [{letter: 'W', state: JUST}, {letter: 'E', state: INIT}, {letter: 'A', state: INIT}, {letter: 'R', state: INIT}, {letter: 'Y', state: INIT}],
    [{letter: 'P', state: INIT}, {letter: 'I', state: EXIST}, {letter: 'L', state: INIT}, {letter: 'L', state: INIT}, {letter: 'S', state: INIT}],
    [{letter: 'V', state: INIT}, {letter: 'A', state: INIT}, {letter: 'G', state: INIT}, {letter: 'U', state: NONE}, {letter: 'E', state: INIT}]
]

const boxSize = 40

const letterBoxesTemplate = (word) => {
    return (
        <div css={css`
            height: ${boxSize}px;
            display: grid;
            column-gap: ${contentGap}px;
            grid-template-columns: repeat(5, ${boxSize}px);
            ${lineLayout2}
        `}>
            {word.map((cur2, i2) => {
                return (<LetterBox
                    line={0}
                    index={i2} 
                    letter={cur2.letter}
                    state={cur2.state}
                    size={boxSize * 1.7}
                    isClearNow= {false}
                    isInputed={false} 
                    key={i2.toString()} 
                />)
            })}
        </div>
    )
}

export default function Guide() {
    const {darkMode} = useContext(SettingContext)
    const borderTop = css`
        border-top: 0.5px solid ${darkMode ? darkColorTone[3] : lightGray};
    `

    const borderBottom = css`
        border-bottom: 0.5px solid ${darkMode ? darkColorTone[3] : lightGray};
    `
    return (
        <>
            <div css={lineLayout}>Guess the <strong>WORDLE</strong> in six tries.</div>
            <div css={lineLayout}>Each guess must be a vaild five-letter word. Hit the enter button to submit.</div>
            <div css={[lineLayout, borderBottom]}>After each guess, the color of the tiles will change to show how close your guess was to the word.</div>
            <div css={[lineLayout2, borderTop]}><strong>Examples</strong></div>
            {letterBoxesTemplate(exampleWords[0])}
            <div css={lineLayout}>The letter <strong>W</strong> is in the word and in the correct spot.</div>
            {letterBoxesTemplate(exampleWords[1])}
            <div css={lineLayout}>The letter <strong>I</strong> is in the word but in the wrong spot.</div>
            {letterBoxesTemplate(exampleWords[2])}
            <div css={[lineLayout, borderBottom]}>The letter <strong>U</strong> is not in the word in any spot.</div>
            <div css={[lineLayout2, borderTop]}><strong>A new WORDLE will be available each day!</strong></div>
        </>
    )
}