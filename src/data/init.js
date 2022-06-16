import { INIT, keyLetters } from "./constants"

export const initState = {
    date: now(), // 현재 날짜
    clear: INIT, // 클리어 상태: 초기 상태. 클리어 미정
    // 현재 레터박스 입력 위치 상태를 표현하는 배열. (현재 글자가 입력된 레터박스 라인과 그 라인 안에 입력된 인덱스를 저장하는 배열.)
    // 배열 0번째 인덱스는 글자가 입력된 레터박스 라인을 표시하고
    // 배열 1번째 인덱스는 그 레터박스 라인에서 현재 입력된 글자의 인덱스를 표시. 
    // 1번째 인덱스가 0 이상이면 그 인덱스의 레터박스에 스케일 애니메이션이 동작하여 글자가 그 위치에 입력되었음을 표현한다.
    // 1번째 인덱스가 라인 안의 들어갈 수 있는 인덱스의 크기를 넘었다면, 레터박스 라인의 쉐이크 애니메이션이 동작하여 
    // 글자가 다 차지 않았거나 입력된 단어가 단어 리스트에 없는 단어로 판명되었음을 표현한다.
    // 초기값은 최초의 라인: 0, 입력된 글자가 없기 때문에: -1
    currentIndex: [0, -1], 
    letterState: Array(6).fill(0).reduce((acc) => {
        acc.push(Array(5).fill(0).reduce((acc2) => {
            // 레터 박스는 입력된 글자와 입력된 글자의 상태, 2가지 값을 상태로 받는다.
            // 상태(state)는 
            // INIT(초기, 입력된 단어가 없음을 뜻함): 0
            // NONE(단어에 해당 글자가 없음): 1
            // EXIST(단어에 해당 글자가 있으나 위치가 올바르지 않음): 2
            // JUST(단어에 해당 글자가 있고 위치도 올바름): 3
            // 으로 구분됨
            acc2.push({
                letter: '',
                state: INIT
            })
            return acc2
        }, []))
        return acc
    }, []), // 5 x 6 형태의 레터박스 상태를 표현하는 배열의 초기값,
    keyboardState: keyLetters.reduce((acc, cur) => {
        acc.push(cur.reduce((acc2, cur2) => {
            // 키박스 역시 입력된 글자와 입력된 글자의 상태, 2가지 값을 상태로 받는다.
            // 상태의 값도 위와 동일
            acc2.push({
                key: cur2,
                state: INIT
            })
            return acc2
        }, []))
        return acc
    }, []) // 가상 키보드 상태를 표현하는 배열의 초기값
} // 앱 동작을 위한 상태의 초기값

function now() {
    const dateObject = new Date()
    const year = dateObject.getFullYear().toString()
    const month = ((dateObject.getMonth() < 9) ? '0' : '') + (dateObject.getMonth() + 1).toString()
    const date = ((dateObject.getDate() <= 9) ? '0' : '') + dateObject.getDate().toString()
    return year + month + date
} // 현재 년월일을 반환하는 함수

export function loadState() {
    const previous = JSON.parse(sessionStorage.getItem("lastState"))
    if (!previous || previous.date < now()) {
        saveState(initState)
        return loadState()
    } else {
        return previous
    }
}

export function saveState(lastState) {
    sessionStorage.setItem("lastState", JSON.stringify(lastState))
}

const initSetting = {
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    hardMode: false,
    highContrastMode: false
} // 앱의 설정의 초기값

export function loadSetting() {
    const previous = JSON.parse(sessionStorage.getItem("setting"))
    if (!previous) {
        saveSetting(initSetting)
        return loadSetting()
    } else {
        return previous
    }
}

export function saveSetting(setting) {
    sessionStorage.setItem("setting", JSON.stringify(setting))
}

const initStatistics = {
    played: 0,
    win: 0,
    currentStreak: 0,
    maxStreak: 0,
    clearCount: [0, 0, 0, 0, 0, 0],
    previousPlayDate: null,
    previousClearLine: null
}

export function loadStatistics() {
    const previous = JSON.parse(sessionStorage.getItem("statistics"))
    if (!previous) {
        saveStatistics(initStatistics)
        return loadStatistics()
    } else {
        return previous
    }
}

function saveStatistics(statistics) {
    sessionStorage.setItem("statistics", JSON.stringify(statistics))
}

export function updateSuccess(clearLine) {
    const statistics = loadStatistics()
    statistics.played += 1
    statistics.win += 1
    statistics.currentStreak += 1
    if (statistics.currentStreak > statistics.maxStreak) {
        statistics.maxStreak = statistics.currentStreak
    }
    statistics.clearCount[clearLine] += 1
    statistics.previousPlayDate = now()
    statistics.previousClearLine = clearLine
    saveStatistics(statistics)
}

export function updateFailure() {
    const statistics = loadStatistics()
    statistics.played += 1
    statistics.currentStreak = 0
    statistics.previousPlayDate = now()
    statistics.previousClearLine = null
    saveStatistics(statistics)
}