import { css, keyframes } from "@emotion/react"
import React, { useContext } from "react"
import { headerHeight, footerHeight, contentPadding, letterBoxesMaxWidth, contentGap, letterBoxesMaxHeight } from "../data/constants"
import { WindowContext } from "../context/WindowContext"
import LetterBox from "./LetterBox"

const shake = keyframes`
    0% {
        transform: translateX(0px);
    }

    10% {
        transform: translateX(-1px);
    }

    20% {
        transform: translateX(2px);
    }

    30% {
        transform: translateX(-3px);
    }

    40% {
        transform: translateX(4px);
    }

    50% {
        transform: translateX(-3px);
    }

    60% {
        transform: translateX(2px);
    }

    70% {
        transform: translateX(-3px);
    }

    80% {
        transform: translateX(4px);
    }

    90% {
        transform: translateX(-3px);
    }

    100% {
        transform: translate(1px);
    }
`

const animation = css`
    animation: ${shake} 600ms;
`

const calcLetterBoxesWidth = (width) => {
    const nowWidth = width - (2 * contentPadding)
    return (nowWidth > letterBoxesMaxWidth) ? letterBoxesMaxWidth : nowWidth
}

const calcLetterBoxesHeight = (height) => {
    const nowHeight = height - (2 * contentPadding)
    return (nowHeight > letterBoxesMaxHeight) ? letterBoxesMaxHeight : nowHeight
}

function Content({letterState, clearNow, currentIndex, onShakeEnd}) {
    const {width, height} = useContext(WindowContext)
    const contentHeight = height - headerHeight - footerHeight
    const letterBoxesHeight = calcLetterBoxesHeight(contentHeight) 
    const letterBoxesWidth = calcLetterBoxesWidth(width)

    const boxWidth = (letterBoxesWidth - (contentGap * (letterState[0].length - 1))) / letterState[0].length
    const boxHeight = (letterBoxesHeight - (contentGap * (letterState.length - 1))) / letterState.length
    const boxSize = (boxWidth > boxHeight) ? boxHeight : boxWidth
    
    const letterBoxes = letterState.map((cur1, i1) => {
        return (
            <div css={css`
                height: ${boxSize}px;
                display: grid;
                column-gap: ${contentGap}px;
                grid-template-columns: repeat(${cur1.length}, ${boxSize}px);
                ${(currentIndex[0] === i1 && currentIndex[1] >= cur1.length) ? animation : css``}
            `} key={i1.toString()}
            onAnimationEnd={onShakeEnd}>
                {cur1.map((cur2, i2) => {
                    return (<LetterBox
                        line={i1}
                        index={i2} 
                        letter={cur2.letter}
                        state={cur2.state}
                        size={boxSize}
                        isClearNow= {(clearNow === i1)}
                        isInputed={(currentIndex[0] === i1 && currentIndex[1] === i2)} 
                        key={i1.toString() + i2.toString()} 
                    />)
                })}
            </div>
        )
    })

    return (
        <section css={css`
            height: ${contentHeight}px;
            display: grid;
            grid-template-columns: minmax(${contentPadding}px, auto) ${letterBoxesWidth}px minmax(${contentPadding}px, auto);
            grid-template-rows: minmax(${contentPadding}px, auto) ${letterBoxesHeight}px minmax(${contentPadding}px, auto);
        `}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <article css={css`
                display: grid;
                justify-content: center;
                row-gap: ${contentGap}px;
            `}>
               {letterBoxes}
            </article>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </section>
    )
}

export default React.memo(Content)