import { css } from "@emotion/react";
import { useContext } from "react";
import { SettingContext } from "../context/SettingContext";
import { WindowContext } from "../context/WindowContext";
import { darkColorTone, lightColorTone, maxHeight } from "../data/constants";


export default function HeightWarning() {
    const {width, height} = useContext(WindowContext)
    const {darkMode} = useContext(SettingContext)

    return (
        <div css={css`
            display: ${height < maxHeight ? 'grid' : 'none'};
            z-index: ${height < maxHeight ? 100 : -1};
            width: ${width}px;
            height: ${height}px;
            position: absolute;
            left: 0;
            top: 0;
            background-color: ${darkMode ? darkColorTone[6] : lightColorTone[6]};
            color:  ${darkMode ? lightColorTone[6] : darkColorTone[6]};
            font-size: 20px;
            text-align: center;
            align-items: center;
        `}>
            Not enough space to display this web app.<br></br>
            Please use your device vertically or use large device.
        </div>
    )
}