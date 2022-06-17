import { css } from "@emotion/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { darkColorTone, darkGreen, EXIST, green, JUST, lightColorTone, NONE, orange, SUCCESS, white } from "../data/constants";
import { loadState, loadStatistics } from "../data/init";
import { SettingContext } from "../context/SettingContext";
import { MdOutlineShare } from "react-icons/md";
import { AlertContext } from "../context/AlertContext";

const span = css`
    font-size: 12px;
`

const numberWidth = 15

export default function Statistics({parentWidth}) {
    const {darkMode, highContrastMode} = useContext(SettingContext)
    const [statisticsData, setStatisticsData] = useState(loadStatistics())
    const [stateData, setStateData] = useState(loadState())
    const distributionWidth = parentWidth / 1.3
    const distributionPadding = (parentWidth - distributionWidth) / 2
    const restWidth = distributionWidth - (2 * numberWidth)
    const zeroWidth = restWidth * 0.06
    const percentPadding = restWidth * 0.02

    useEffect(() => {
        setStatisticsData(loadStatistics())
    }, [])

    useEffect(() => {
        setStateData(loadState())
    }, [])

    const percentCss = css`
        justify-content: right;
        padding-right: ${percentPadding}px;
        color: ${white};
        background-color: ${(darkMode) ? darkColorTone[2] : lightColorTone[2]};
    `

    const zeroCss = css`
        justify-content: center;
        box-sizing: border-box;
        border: 1px solid ${(darkMode) ? darkColorTone[2] : lightColorTone[2]};
    `

    const clearCss = css`
        background-color: ${(highContrastMode) ? orange : (darkMode) ? darkGreen : green};
    `

    const clearCount = (statisticsData.previousPlayDate) ? statisticsData.clearCount.map((cur, i) => {
        const graphWidth = (cur > 0) ? restWidth * cur / statisticsData.played - percentPadding : zeroWidth
        return (
            <div css={css`
                display: flex;
                justify-content: left;
                padding-bottom: 5px;
                font-size: 14px;
            `} key={i.toString()}>
                <span css={css`
                    width: ${numberWidth}px;
                    height: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                `}>{i + 1}</span>
                <span css={css`
                    width: ${graphWidth}px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    ${(cur > 0) ? percentCss : zeroCss}
                    ${statisticsData.previousPlayDate === stateData.date &&
                        stateData.clear === SUCCESS &&
                        i === statisticsData.previousClearLine ? clearCss : ''}
                `}><strong>{cur}</strong></span>
            </div>
        )
    }) : 'No data'

    return (
        <>
            <div css={css`
                padding: 0px 0px 30px 0px;
                display: grid;
                justify-content: center;
                grid-template-columns: repeat(4, 1fr);
                font-size: 36px;
            `}>
                <span>{statisticsData.played}</span>
                <span>{(statisticsData.played > 0 && statisticsData.win > 0) ? Math.floor(statisticsData.win / statisticsData.played * 10) / 10 * 100 : statisticsData.win}</span>
                <span>{statisticsData.currentStreak}</span>
                <span>{statisticsData.maxStreak}</span>
                <span css={span}>Played</span>
                <span css={span}>Win %</span>
                <span css={span}>Current <br />Streak</span>
                <span css={span}>Max <br />Streak</span>
            </div>
            <div>
                <strong>GUESS DISTRIBUTION</strong>
            </div>
            <div css={css`
                padding: 10px ${distributionPadding}px 23px ${distributionPadding}px;
                width: ${distributionWidth}px;
            `}>
                {clearCount}
            </div>
            {(statisticsData.previousPlayDate === stateData.date) ? <Share parentWidth={parentWidth} stateData={stateData} /> : ''}
        </>
    )
}

function Share({parentWidth, stateData}) {
    const {darkMode, highContrastMode} = useContext(SettingContext)
    const {alert, setAlert} = useContext(AlertContext)
    const dateObject = new Date()
    const remainHours = 24 - dateObject.getHours() - 1
    const remainMinutes = 60 - dateObject.getMinutes() - 1
    const remainSeconds = 60 - dateObject.getSeconds() - 1
    const [hours, setHours] = useState(timeToString(remainHours))
    const [minutes, setMinutes] = useState(timeToString(remainMinutes))
    const [seconds, setSeconds] = useState(timeToString(remainSeconds))

    useInterval(() => {
        let nowSeconds = parseInt(seconds)
        let nowMinutes = parseInt(minutes)
        let nowHours = parseInt(hours)
        nowSeconds -= 1
        if (nowSeconds < 0) {
            nowSeconds = 59
            nowMinutes -= 1
            if (nowMinutes < 0) {
                nowMinutes = 59
                nowHours -= 1
            }
        }
        setSeconds(timeToString(nowSeconds))
        setMinutes(timeToString(nowMinutes))
        setHours(timeToString(nowHours))
    }, (hours === '00' && minutes === '00' && seconds === '00') ? null : 1000)

    const copy = () => {
        const text = stateData.letterState.reduce((acc, cur) => {
            const lineText = cur.reduce((a, c) => {
                if (c.state === NONE) {
                    a += `⬛`
                } else if (c.state === EXIST) {
                    a += (highContrastMode) ? `🟦` : `🟨`
                } else if (c.state === JUST) {
                    a += (highContrastMode) ? `🟧` : `🟩`
                }
                return a
            }, ``)
            if (lineText !== ``) {
                acc += lineText + `\n`
            }
            return acc
        }, `Wordle ${(stateData.clear === SUCCESS) ? stateData.currentIndex[0] : 'X'}/6\n\n`)
        if ('clipboard' in navigator) {
            navigator.clipboard.writeText(text);
        } else {
            document.execCommand('copy', true, text);
        }
        setAlert([...alert, "Copied results to clipboard"])
    }

    return (
        <div css={css`
            padding: 0px 0px 15px 0px;
            display: flex;
        `}>
            <div css={css`
                width: ${parentWidth / 2}px;
                box-sizing: border-box;
                border-right: 1px solid black;
            `}>
                <div><strong>NEXT WORDLE</strong></div>
                <div css={css`
                    font-size: 36px;
                `}>{hours}:{minutes}:{seconds}</div>
            </div>
            <div css={css`
                width: ${parentWidth / 2}px;
                box-sizing: border-box;
                border-left: 1px solid black;
                display: flex;
                justify-content: center;
                align-items: center;
            `}>
                <button css={css`
                    width: ${parentWidth / 2 * 0.8}px;
                    height: 50px;
                    border: 0;
                    border-radius: 8px;
                    background-color: ${(highContrastMode) ? orange : (darkMode) ? darkGreen : green};
                    cursor: pointer;
                    font-size: 20px;
                    color: ${white};
                    display: flex;
                    justify-content: center;
                    align-items: center;
                `} onClick={copy}>
                    <strong css={css`
                        padding-right: 3px;
                    `}>SHARE</strong> 
                    <MdOutlineShare css={css`
                        padding-left: 3px;
                    `} size={25} />
                </button>
            </div>
        </div>
    )
}

function timeToString(time) {
    return ((time < 10) ? '0' :  '') + time.toString()
}

function useInterval(callback, delay) {
    const savedCallback = useRef(); // 최근에 들어온 callback을 저장할 ref를 하나 만든다.
  
    useEffect(() => {
      savedCallback.current = callback; // callback이 바뀔 때마다 ref를 업데이트 해준다.
    }, [callback]);
  
    useEffect(() => {
      function tick() {
        savedCallback.current(); // tick이 실행되면 callback 함수를 실행시킨다.
      }
      if (delay !== null) { // 만약 delay가 null이 아니라면 
        let id = setInterval(tick, delay); // delay에 맞추어 interval을 새로 실행시킨다.
        return () => clearInterval(id); // unmount될 때 clearInterval을 해준다.
      }
    }, [delay]); // delay가 바뀔 때마다 새로 실행된다.
}