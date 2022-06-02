import { css, keyframes } from "@emotion/react";
import { useContext } from "react";
import { yellow, green, delay, transitionTime, INIT, NONE, EXIST, skyblue, orange, darkYellow, darkGreen, darkColorTone, lightColorTone } from "../data/constants";
import { FilpEndContext } from "../context/FilpEndContext";
import { SettingContext } from "../context/SettingContext";

const container = css`
    background-color: transparent;
    width: 100%;
    height: 100%;
    perspective: 1000px;
`

const inner = css`
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform ${transitionTime}ms;
`

const element = css`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
`

const inputAnimation = keyframes`
    from, to {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
`

const clearAnimation = keyframes`
    0%, 100% {
        transform: translateY(0)
    }

    25% {
        transform: translateY(-40%)
    }

    50% {
        transform: translateY(10%)
    }

    75% {
        transform: translateY(-10%)
    }
`

export default function LetterBox ({line, index, letter, state, size, isClearNow, isInputed}) {
    const {darkMode, highContrastMode} = useContext(SettingContext)
    const FilpEndEvent = useContext(FilpEndContext)

    const borderColor = (letter !== '') ? ((darkMode) ? darkColorTone[2] : lightColorTone[2]) 
    : ((darkMode) ? darkColorTone[3] : lightColorTone[3])

    const fontSize = css`
        font-size: ${size / 1.9}px;
        font-weight: 700;
    `

    const checkForm = css`
        background-color: ${
            (state === INIT) ? `255, 255, 255` :
            (state === NONE) ? `${(darkMode) ? darkColorTone[3] : lightColorTone[1]}`:
            (state === EXIST) ? `${(highContrastMode) ? skyblue : (darkMode) ? darkYellow : yellow}` : 
            `${((highContrastMode) ? orange : (darkMode) ? darkGreen : green)}` 
        };
        color: white;
    `

    const front = (!isClearNow) ? css`
        border: 2px solid ${borderColor};
        color: ${darkMode ? 'white' : 'black'}
    ` : checkForm

    const back = css`
        ${checkForm}
        transform: rotateX(180deg);
    `

    const checkTrans = (state === INIT) ? css`` 
    : css`
        transition-delay: ${delay[index]}ms;
        transform: rotateX(180deg);
    `

    const inputTrans = (isInputed && letter !== '') ? css`
        animation: ${inputAnimation} 100ms;
    ` : css``

    const clearTrans = (isClearNow) ? css`
        animation-name: ${clearAnimation};
        animation-duration: ${transitionTime}ms;
        animation-delay: ${delay[index]}ms;
    ` : css``

    const filpEndhandler = () => {
        if (index === delay.length - 1) { // 레터박스 라인의 마지막 인덱스의 레터박스가 플립 애니메이션이 끝났다면
            FilpEndEvent(line) // 이벤트 실행
        } else { // 그 외의 레터박스들의 이벤트 트리거는
            return // 무시
        }
    }

    return (
        <div css={container}>
            <div css={[inner, checkTrans, inputTrans, clearTrans]} onTransitionEnd={filpEndhandler}>
                <span css={[element, fontSize, front]}>{letter}</span>
                <span css={[element, fontSize, back]}>{letter}</span>
            </div>
        </div>
    )
}