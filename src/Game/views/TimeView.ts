import { ONE_SECOND } from "../GameUtils";

export class TimeView {
    public static readonly timeTokenBoxID = 'timeTokenBox';
    public static readonly timeTokenBoxWrapperID = 'timeTokenBoxWrapper';
    public static readonly timerBoxID = 'timerBox';
    public static readonly timerBoxWrapperID = 'timerBoxWrapper';
  
    timeTokenBox: HTMLDivElement
    timeTokenBoxWrapper: HTMLDivElement
    timerBox: HTMLDivElement
    timerBoxWrapper: HTMLDivElement
    clock: HTMLDivElement
    time: HTMLSpanElement
  
    constructor(columns: number) {
        this.timeTokenBox = document.createElement('div')
        this.timeTokenBox.id = TimeView.timeTokenBoxID
  
        this.timeTokenBoxWrapper = document.createElement('div')
        this.timeTokenBoxWrapper.id = TimeView.timeTokenBoxWrapperID

        for (let i = 1; i <= columns; i++) {
            const col = document.createElement('div')

            const token1 = document.createElement('div')
            token1.id = `timeToken-${i}-1`
            const token1Wrapper = document.createElement('div')
            token1Wrapper.appendChild(token1)

            const token2 = document.createElement('div')
            token2.id = `timeToken-${i}-2`
            const token2Wrapper = document.createElement('div')
            token2Wrapper.appendChild(token2)

            col.appendChild(token1Wrapper)
            col.appendChild(token2Wrapper)
            this.timeTokenBox.appendChild(col)
        }
    
        this.timerBox = document.createElement('div')
        this.timerBox.id = TimeView.timerBoxID
    
        this.timerBoxWrapper = document.createElement('div')
        this.timerBoxWrapper.id = TimeView.timerBoxWrapperID

        this.clock = document.createElement('div')
        this.clock.id = 'clock'
        const clockFace = document.createElement('div')
        this.time = document.createElement('span')
        clockFace.appendChild(this.time)
        this.clock.appendChild(clockFace)
    
        this.timeTokenBoxWrapper.appendChild(this.timeTokenBox)
        this.timerBoxWrapper.appendChild(this.timerBox)
    }
    
    show(): void {
        window.document.body.appendChild(this.timeTokenBoxWrapper)
        window.document.body.appendChild(this.timerBoxWrapper)
    }
    
    close(): void {
        window.document.body.removeChild(this.timeTokenBoxWrapper)
        window.document.body.removeChild(this.timerBoxWrapper)
    }

    startTimer(seconds: number): void {
        this.timerBox.appendChild(this.clock)
        this.evaluateTimer(seconds, seconds)
    }

    private evaluateTimer(remaining: number, total: number): void {
        const clock = document.getElementById('clock')
        if (clock) {
            clock.style.backgroundImage = `conic-gradient(#EDB872 ${(total - remaining) * 100 / total}%, 0, #677818)`
        }
        const remainingMinutes = Math.floor(remaining / 60)
        let remainingMinutesString = remainingMinutes.toString()
        if (remainingMinutes < 10) {
            remainingMinutesString = '0' + remainingMinutesString
        }
        const remainingSeconds = remaining % 60
        let remainingSecondsString = remainingSeconds.toString()
        if (remainingSeconds < 10) {
            remainingSecondsString = '0' + remainingSecondsString
        }
        this.time.textContent = `${remainingMinutesString}:${remainingSecondsString}`
        if (remaining === 0) {
            return
        }
        setTimeout(() => {this.evaluateTimer(remaining - 1, total)}, ONE_SECOND)
    }
}