import { css, keyframes } from "@emotion/react"
import { useContext } from "react"
import { black, blurPadding, darkColorTone, fadeTime, lightGray, white } from "../data/constants"
import { WindowContext } from "../context/WindowContext"
import { IoMdClose } from "react-icons/io"
import { SettingContext } from "../context/SettingContext"

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translate3d(0, 10%, 0);
    }
    to {
        opacity: 1;
        transform: translateZ(0);
    }
`

const fadeOutDown = keyframes`
    from {
        opacity: 1;
        transform: translateZ(0);
    }
    to {
        opacity: 0;
        transform: translate3d(0, 10%, 0);
    }
`

const fadeAnimation = (isFadeOut) => {
    return css`animation: ${(isFadeOut) ? fadeOutDown : fadeInUp} ${fadeTime}ms;`
}

export default function BlurBackground({children, contentWidth, contentHeight, isVisible, isFadeOut, onInvisible, title}) {
    const {darkMode} = useContext(SettingContext)
    const {width, height} = useContext(WindowContext)
    const fullContentHeight = 58.5 + contentHeight
    const trueContentHeight = (height >= (blurPadding * 2) + fullContentHeight) ? fullContentHeight : height - (blurPadding * 2)
    const contentPadding = (width - contentWidth) / 2

    return (
        <div css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: ${width}px;
            height: ${height}px;
            background-color: rgba(${darkMode ? `0, 0, 0` : `255, 255, 255`}, 0.5);
            display: grid;
            grid-template-columns: ${contentPadding}px ${contentWidth}px ${contentPadding}px;
            grid-template-rows: minmax(${blurPadding}px, auto) ${trueContentHeight}px minmax(${blurPadding}px, auto);
            z-index: ${isVisible ? 1 : -1};
            opacity: ${isVisible ? 1 : 0};
        `}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div css={css`
                box-shadow: 0 0 20px ${darkMode ? darkColorTone[2] : lightGray};
                border-radius: 8px;
                background-color: ${darkMode ? black : white};
                overflow: scroll;
                ${isVisible ? fadeAnimation(isFadeOut) : ``}
            `}>
                <div css={css`
                    position: relative;
                    height: 25px;
                    padding-top: 15px;
                    margin-bottom: 15px;
                    border-bottom: 1.5px solid ${darkMode ? white : black};
                `}>
                    <div css={css`
                        position: absolute;
                        width: 100%;
                        top: 15px;
                        left: 0;
                    `}>
                        <strong>{title}</strong>
                    </div>
                    <IoMdClose css={css`
                        cursor: pointer;
                        position: absolute;
                        top: 13px;
                        right: 16px;
                    `} size={24} onClick={onInvisible}/>
                </div>
                {children}
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}