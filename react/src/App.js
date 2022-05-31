import { clearMention, darkColorTone, EXIST, FAILURE, INIT, JUST, keyLetters, lightColorTone, NONE, NOTOPEN, STATISTICS, SUCCESS } from './data/constants';
import words from "./data/words.json";
import { cloneDeep } from 'lodash';
import { useState, useEffect } from 'react';
import useWindowSize from "./hook/useWindowSize"
import Header from './components/Header';
import Content from './components/Content';
import Keyboard from './components/Keyboard';
import Alert from './components/Alert';
import { FilpEndContext } from "./context/FilpEndContext";
import { WindowContext } from "./context/WindowContext";
import { SettingContext } from './context/SettingContext';
import { AlertContext } from './context/AlertContext';
import { initState, loadSetting, loadState, saveSetting, saveState, updateFailure, updateSuccess } from './data/init';

const wordIndex = words.reduce((acc, cur, i) => {
    acc.set(cur.toUpperCase(), i)
    return acc
}, new Map()) // 단어 리스트.

const keyboardIndex = keyLetters.reduce((acc, cur, i) => {
    cur.map((cur2, i2) => {
        acc.set(cur2, [i, i2])  // 키박스의 위치 저장
        return null
    })
    return acc
}, new Map())  // 가상 키보드의 키박스의 인덱스를 저장할 변수

const lastState = loadState() // 상태의 변화를 저장하는 변수

const setting = loadSetting() // 세팅의 변화를 저장하는 변수

let clearLine = -1 // 앱 동작 중 클리어 상태를 저장하는 변수(-2: 실패, -1: 미클리어, 0 ~ 5: 성공, 숫자는 클리어에 성공한 라인)

export default function App() {
    const {width, height} = useWindowSize()
    // 밑에 4가지 변수는 상태를 업데이트해서 랜더링을 하기 위한 변수 
    const [letterState, setLetterState] = useState(initState.letterState) // 레터박스 상태
    const [keyboardState, setKeyboardState] = useState(initState.keyboardState) // 키보드 상태
    const [currentIndex, setCurrentIndex] = useState(initState.currentIndex) // 현재 레터박스 입력 위치 상태
    const [clearNow, setClearNow] = useState(-1) // 앱 실행 중 클리어 상태
    // 레터박스가 플립 애니메이션 도중인가 아닌가를 표시하는 변수.
    // 레터박스가 플립 애니메이션 도중이라 함은 그 단어가 올바른 단어인지를 체크하여 보여주는 도중이기에 입력 이벤트가 동작하지 못하게 하기 위함
    // 만약 스토리지에 이미 입력된 레터박스 라인이 존재한다면 랜더링 후 플립 애니메이션이 동작한다.
    const [trans, setTrans] = useState((lastState.currentIndex[0] > 0))
    const [cAlert, setCAlert] = useState({
        visibleCount: 0,
        string: '',
        isClearMention: false
    }) // 커스텀 알림
    const [popMenu, setPopMenu] = useState(NOTOPEN) // 헤더 메뉴 오픈 상태
    const [darkMode, setDarkMode] = useState(setting.darkMode) // 다크 모드 상태
    const [hardMode, setHardMode] = useState(setting.hardMode) // 하드 모드 상태
    const [highContrastMode, setHighContrastMode] = useState(setting.highContrastMode) // 색약 모드 상태

    useEffect(() => {
        document.body.style.backgroundColor = (darkMode) ? darkColorTone[6] : lightColorTone[6]
        document.body.style.color = (darkMode) ? darkColorTone[0] : lightColorTone[0]
    }, [darkMode])

    useEffect(() => {
        if (trans) { // 플립 애니메이션이 동작했다면
            setCurrentIndex(lastState.currentIndex) // 변화한 현재 레터박스 인덱스 상태 업데이트
            setLetterState(lastState.letterState) // 변화한 레터 박스 상태 업데이트
        }
    }, [trans])

    useEffect(() => {
        const handler = (e) => {
            const key = e.key.toUpperCase()
            if (/^[A-Z]$/.test(key) || key === "ENTER" || key === "BACKSPACE") {
                onInput(key)
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    })

    const onInput = (key) => {
        //  이미 클리어 판정이 났거나 레터박스의 플립 애니메이션 도중이라면,
        if (lastState.clear !== INIT || trans) {
            return // 동작하지 않는다.
        }
        // 현재 글자가 입력될 레터박스 라인의 인덱스
        const lineIndex = currentIndex[0]
        // 현재 레터박스 라인 중 아직 입력되지 않은 위치의 인덱스. 모두 입력되었다면 -1을 반환
        const letterIndex = letterState[lineIndex].findIndex(el => el.letter === '')
        // 레터박스 상태를 깊은 복사하여 저장. 이벤트가 강제로 종료되도 상태에 영향을 주지 않기 위함
        const tempLetter = cloneDeep(letterState) 
        if (/^[A-Z]$/.test(key)) { // 입력된 키 값이 알파벳이라면
            if (letterIndex > -1) { // 만약 빈 공간이 있다면
                tempLetter[lineIndex][letterIndex].letter = key // 그 박스에 입력된 글자를 넣는다
                setCurrentIndex([lineIndex, letterIndex]) // 스케일 애니메이션 동작을 위해 현재 입력된 위치를 표시하고
                setLetterState(tempLetter) // 레터 박스 상태 업데이트
            }
        } else if (key === 'BACKSPACE') { // 입력된 키 값이 백스페이스였다면
            if (currentIndex[1] !== -1) { // 삭제 도중 스케일 애니메이션이 동작하지 않게끔 하기 위함
                setCurrentIndex([lineIndex, -1])
            }
            if (letterIndex !== 0) { // 입력된 글자가 있을 경우
                const eraseIndex = ((letterIndex === -1) ? letterState[lineIndex].length : letterIndex) - 1 // 최후미의 글자를 색출하여
                tempLetter[lineIndex][eraseIndex].letter = '' // 지운다
                setLetterState(tempLetter) // 레터 박스 상태 업데이트
            }
        } else if (key === 'ENTER') { // 입력된 키 값이 엔터였다면
            if (letterIndex !== -1) { // 글자가 모두 입력되지 않았다면
                setCAlert({
                    ...cAlert,
                    visibleCount: cAlert.visibleCount + 1, 
                    string: "Not enough letters"
                }) // 모두 입력되지 않았음을 알리고
                if (currentIndex[1] !== letterState[0].length) {
                    setCurrentIndex([lineIndex, letterState[0].length]) // 레터박스 라인의 쉐이크 애니메이션 동작
                }
                return // 이후 동작하지 않는다
            } else { // 글자가 모두 입력되었다면
                const lineWord = tempLetter[lineIndex].reduce((acc, cur) => {
                    acc += cur.letter
                    return acc
                }, '') // 레터박스 라인의 글자를 하나로 합쳐 단어 생성
                if (!wordIndex.has(lineWord)) { // 생성된 단어가 존재하는지 확인하여 만약 없다면
                    setCAlert({
                        ...cAlert,
                        visibleCount: cAlert.visibleCount + 1, 
                        string: "Not in word list"
                    }) // 단어 리스트에 없다고 알리고
                    if (currentIndex[1] !== letterState[0].length) {
                        setCurrentIndex([lineIndex, letterState[0].length]) // 레터박스 라인의 쉐이크 애니메이션 동작
                    }
                    return  // 이후 동작하지 않는다.
                }
            }
            // 입력된 글자에 대한 상태 판단
            // JUST, EXIST, NONE 순으로 판단한다.
            lastState.word.split('').reduce((acc, cur, i) => { // 정답 단어를 분해하여 배열 형태로 변환하여 reduce. 초기값은 빈 배열로 최종적으로 JUST 판정이 난 글자들을 다른 글자로 치환한 배열이 나온다.
                if (cur === tempLetter[lineIndex][i].letter) { // 단어의 특정 위치의 글자가 현재 레터 박스 라인의 같은 위치의 글자와 동일하다면
                    tempLetter[lineIndex][i].state = JUST // 해당 레터 박스 글자의 상태를 JUST로 수정
                    acc.push('0') // 그리고 이미 JUST 판정이 난 글자는 알파벳이 아닌 글자로 수정해서 추가로 JUST가 나오지 않도록 한다. 
                } else { // 동일하지 않다면
                    acc.push(cur) // 그대로 넣는다.
                }
                return acc
            }, []).reduce((acc, cur) => { // JUST 판정을 거쳐 나온 배열을 다시 reduce. 초기값은 Map 객체. 이미 EXIST 판정이 난 글자를 인식하기 위함
                // 단어의 특정 글자가 위치하는 레터 박스 라인의 인덱스를 찾는다. 그 이전에 이미 EXIST 판정이 난 글자는 제외한다.
                // * 이미 JUST 판정이 난 글자는 알파벳이 아닌 다른 글자로 치환되었기 때문에 찾을 수 없다.
                const existIndex = tempLetter[lineIndex].findIndex((el, i) => (el.letter === cur) && !acc.has(i))
                if (existIndex !== -1) { // 인덱스를 찾았다면
                    tempLetter[lineIndex][existIndex].state = EXIST // 그 인덱스의 글자의 상태를 EXIST로 수정
                    acc.set(existIndex, true) // EXIST 판정이 난 인덱스를 Map 객체에 저장해둔다.
                }
                return acc
            }, new Map())
            // 최종적으로 JUST와 EXIST 판정을 받지 못한 INIT 상태를 전부 NONE으로 바꾼다.
            tempLetter[lineIndex].map((cur) => {
                if (cur.state === INIT) {
                    cur.state = NONE
                }
                return null
            })
            // 키보드 상태를 깊은 복사하여 저장
            const tempKey = cloneDeep(keyboardState)
            const isCleared = tempLetter[lineIndex].reduce((acc, cur) => { // 현재 판정이 끝난 레터박스 라인의 글자들의 상태를 바탕으로 해당 글자의 키박스 상태를 변경하며, 올바른 글자들로 구성되었는지 판단한다.
                const i = keyboardIndex.get(cur.letter) // 해당 글자의 키박스 위치
                const keybox = tempKey[i[0]][i[1]] // 키박스
                if (cur.state > keybox.state) { // 키박스의 상태 변경
                    keybox.state = cur.state // INIT(초기) : 0, NONE: 1, EXIST: 2, JUST: 3 가장 큰 값을 가지는 상태로 업데이트된다.
                }
                if (cur.state !== JUST) { // 만약 하나라도 올바른 글자가 아니라면
                    acc = false // 클리어하지 못함으로 판단
                }
                return acc
            }, true)
            lastState.currentIndex = [lineIndex + 1, -1] // 레터박스 라인의 인덱스를 증가하여 저장
            lastState.letterState = tempLetter // 변화된 레터박스 상태 저장
            lastState.keyboardState = tempKey // 변화된 키보드 상태 저장
            if (isCleared) {
                lastState.clear = SUCCESS // 클리어 상태를 성공으로 저장
                clearLine = lineIndex // 앱 동작 중 클리어 성공했음을 확인했음으로 클리어 라인 저장
                updateSuccess(clearLine)
            } else if (lastState.currentIndex[0] >= letterState.length) { // 미클리어 상태로 모든 라인에 글자가 입력되었다면
                lastState.clear = FAILURE // 클리어 상태를 실패로 저장
                clearLine = -2 // 앱 동작 중 클리어 실패했음으로 -2
                updateFailure()
            }
            saveState(lastState) // 변화된 상태를 저장한 변수를 스토리지에 저장
            setTrans(true) // 플립 애니메이션 동작
        } 
    } // 글자 입력 이벤트

    const onShakeEnd = () => {
        setCurrentIndex([currentIndex[0], -1]) // 현재 레터박스 인덱스 상태의 1번째 인덱스를 -1로 바뀌어 스케일 애니메이션과 쉐이크 애니메이션이 동작하지 않게 한다.
    } // 레터박스 라인의 쉐이크 애니메이션이 끝나면 동작하는 이벤트

    const onFilpEnd = (line) => {
        if (line === currentIndex[0] - 1) { // 현재 입력된 마지막 레터박스 라인의 마지막 인덱스의 레터박스가 플립 애니메이션이 끝났다면
            setKeyboardState(lastState.keyboardState) // 변화된 키보드 상태 업데이트
            setTrans(false) // 플립 애니메이션이 끝났음을 표시
            if (clearLine >= 0 && lastState.clear === SUCCESS) { // 앱 동작 중 클리어 성공했다면
                setClearNow(clearLine)
                setCAlert({
                    visibleCount: cAlert.visibleCount + 1, 
                    string: clearMention[currentIndex[0] - 1],
                    isClearMention: true
                })
            } else if (clearLine < -1 && lastState.clear === FAILURE) { // 앱 동작 중 클리어 실패했다면
                setCAlert({
                    visibleCount: cAlert.visibleCount + 1, 
                    string: lastState.word,
                    isClearMention: true
                })
            } else if (lastState.clear !== INIT) { // 앱 동작 전에 이미 클리어 결과가 존재한다면
                setPopMenu(STATISTICS) // statistics 메뉴 화면을 띄운다
            }
        }
    } // 플립 애니메이션이 끝나면 동작하는 이벤트

    const onPopMenu = (menuNumber) => {
        setPopMenu(menuNumber)
    }

    const onDark = () => {
        setDarkMode(!darkMode)
        saveSetting({
            darkMode: !darkMode,
            highContrastMode: highContrastMode,
            hardMode: hardMode
        })
    } // 다크 모드 상태 변화 이벤트

    const onHard = () => {
        setHardMode(!hardMode)
        saveSetting({
            darkMode: darkMode,
            highContrastMode: highContrastMode,
            hardMode: !hardMode
        })
    } // 하드 모드 상태 변화 이벤트

    const onContrast = () => {
        setHighContrastMode(!highContrastMode)
        saveSetting({
            darkMode: darkMode,
            highContrastMode: !highContrastMode,
            hardMode: hardMode
        })
    } // 색약 모드 상태 변화 이벤트

    const alertClear = (isClearMention) => {
        setCAlert({
            visibleCount: 0,
            string: '',
            isClearMention: false
        })
        if (isClearMention) {
            setPopMenu(STATISTICS)
        }
    }

    return (
        <WindowContext.Provider value={{width, height}}>
        <AlertContext.Provider value={{cAlert, setCAlert}}>
        <SettingContext.Provider value={{darkMode, hardMode, highContrastMode, onDark, onHard, onContrast}}>
            <Header popMenu={popMenu} onPopMenu={onPopMenu} />
            <FilpEndContext.Provider value={onFilpEnd}>
                <Content letterState={letterState} clearNow={clearNow} currentIndex={currentIndex} onShakeEnd={onShakeEnd}></Content>
            </FilpEndContext.Provider>
            <Keyboard keyboardState={keyboardState} onInput={onInput} />
            <Alert cAlert={cAlert} alertClear={alertClear} />
        </SettingContext.Provider>
        </AlertContext.Provider>
        </WindowContext.Provider>
    );
}
