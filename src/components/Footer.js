import { css } from "@emotion/react";
import { footerHeight, footerMarginBottom, keyboardMaxWidth, footerPadding } from "../data/constants";

const footerLayout = css`
    height: ${footerHeight - footerMarginBottom}px;
    display: grid;
    grid-template-columns: minmax(${footerPadding}px, auto) minmax(auto, ${keyboardMaxWidth - (2 * footerPadding)}px) minmax(${footerPadding}px, auto);
`

export default function Footer({children}) {
    return (
        <footer css={footerLayout}>
            <div></div>
            {children}
            <div></div>
        </footer>
    )
}