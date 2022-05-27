import { css } from "@emotion/react"
import { darkColorTone, darkGreen, darkYellow, EXIST, green, INIT, lightColorTone, NONE, orange, skyblue, yellow} from "../data/constants"
import { MdOutlineBackspace } from "react-icons/md"
import { useContext } from "react"
import { SettingContext } from "../context/SettingContext"

const layout = css`
    border-radius: 4px;
    display: grid;
    place-items: center;
    cursor: pointer;
`

export default function KeyBox ({letter, state, onInput}) {
    const {darkMode, highContrastMode} = useContext(SettingContext)

    const color = (state === INIT) ? (darkMode) ? darkColorTone[1] : lightColorTone[3]
        : (state === NONE) ? (darkMode) ? darkColorTone[3] : lightColorTone[1]
        : (state === EXIST) ? ((highContrastMode) ? skyblue : (darkMode) ? darkYellow : yellow) 
        : ((highContrastMode) ? orange : (darkMode) ? darkGreen : green) 

    const keyState = css`
        font-size: ${(letter === 'ENTER') ? '12' : '14'}px;
        font-weight: 900;
        color: ${(state === INIT && !darkMode) ? lightColorTone[0] : lightColorTone[6]};
        background-color: ${color};
    `
    
    const handler = () => {
        onInput(letter)
    }

    return (
        <span css={[layout, keyState]} onClick={handler}>
            {(letter === 'BACKSPACE') ? <MdOutlineBackspace size={24} /> : <strong>{letter}</strong>}
        </span>
    )
}