import { useContext } from "react";
import { css } from "@emotion/react";
import { keyGap, keyLineGap, keyboardMaxWidth, footerPadding } from "../data/constants";
import { WindowContext } from "../context/WindowContext";
import Footer from "./Footer";
import KeyBox from "./KeyBox";

export default function Keyboard({keyboardState, onInput}) {
    const {width} = useContext(WindowContext)
    const keyboardWidth = ((width > keyboardMaxWidth) ? keyboardMaxWidth : width) - (2 * footerPadding)
    const firstLineKeyWidth = (keyboardWidth - ((keyboardState[0].length - 1) * keyGap)) / keyboardState[0].length
    const secondLinePadding = ((keyboardWidth - ((keyboardState[1].length * (firstLineKeyWidth)) + ((keyboardState[1].length + 1) * (keyGap)))) / 2) - 2.5
    const secondLineKeyWidth = Math.floor((keyboardWidth - (((keyboardState[1].length + 1) * keyGap) + (2 * secondLinePadding))) / keyboardState[1].length * 100) / 100

    const keyboard = keyboardState.map((cur1, i1) => {
        const layout = css`
            display: grid;
            height: 58px;
            column-gap: ${keyGap}px;
            grid-template-columns: 
            ${(i1 === 0) ? `repeat(${cur1.length}, 1fr);` 
                : (i1 === 1) ? (
                    (secondLinePadding > 0 ) ? `minmax(auto, ${secondLinePadding}px) repeat(${cur1.length}, 1fr) minmax(auto, ${secondLinePadding}px);`
                     : `repeat(${cur1.length}, 1fr)`
                ) : `minmax(40.8px, ${secondLineKeyWidth + keyGap + secondLinePadding}px) repeat(${cur1.length - 2}, ${secondLineKeyWidth}px) 1fr;`}
            
        `

        return (
            <div css={layout} key={i1.toString()}>
                {(i1 === 1 && secondLinePadding > 0) ? <div></div> : ``}
                {cur1.map((cur2, i2) => {
                    return (
                        <KeyBox 
                            letter={cur2.key} 
                            state={cur2.state}
                            onInput={onInput}
                            key={cur2.key + cur2.state.toString() + i2.toString()} 
                        />
                    )
                })}
                {(i1 === 1 && secondLinePadding > 0) ? <div></div> : ``}
            </div>
        )
    })

    return (
        <Footer>
            <div css={css`
                display: grid;
                row-gap: ${keyLineGap}px;
            `}>
                {keyboard}
            </div>
        </Footer>
    )
}