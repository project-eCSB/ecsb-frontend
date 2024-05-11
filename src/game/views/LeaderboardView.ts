import { type EndGameStatus } from '../../apis/game/Types'
import {
  createButtonWithId,
  createDivWithId,
  createElWithText,
  createIcon,
  createIconWithWidth,
} from './ViewUtils'

export class LeaderboardView {
  public static readonly leaderboardID = 'leaderboard'
  public static readonly leaderboardTitleBoxWrapperID = 'leaderboardTitleBoxWrapper'
  public static readonly leaderboardTitleBoxID = 'leaderboardTitleBox'
  public static readonly leaderboardHeaderBoxWrapperID = 'leaderboardHeaderBoxWrapper'
  public static readonly leaderboardHeaderBoxID = 'leaderboardHeaderBox'
  public static readonly leaderboardContentBoxID = 'leaderboardContentBox'
  public static readonly leaderboardContentBoxWrapperID = 'leaderboardContentBoxWrapper'
  public static readonly leaderboardButtonID = 'leaderboardButton'
  public static readonly leaderboardButtonWrapperID = 'leaderboardButtonWrapper'
  public static readonly leaderboardButtonGlowID = 'leaderboardButtonGlow'

  private readonly leaderboard: HTMLDivElement

  constructor(status: EndGameStatus, playerId: string, destroy: () => void) {
    this.leaderboard = createDivWithId(LeaderboardView.leaderboardID)
    const leaderboardTitleBoxWrapper = createDivWithId(LeaderboardView.leaderboardTitleBoxWrapperID)
    const leaderboardTitleBox = createDivWithId(LeaderboardView.leaderboardTitleBoxID)
    const leaderboardHeaderBoxWrapper = createDivWithId(LeaderboardView.leaderboardHeaderBoxWrapperID)
    const leaderboardHeaderBox = createDivWithId(LeaderboardView.leaderboardHeaderBoxID)
    const leaderboardContentBoxWrapper = createDivWithId(LeaderboardView.leaderboardContentBoxWrapperID)
    const leaderboardContentBox = createDivWithId(LeaderboardView.leaderboardContentBoxID)

    const scrollBox = document.createElement('div')
    const leaderboardButton = createButtonWithId(LeaderboardView.leaderboardButtonID)
    const leaderboardButtonWrapper = createDivWithId(LeaderboardView.leaderboardButtonWrapperID)
    const leaderboardButtonGlow = createDivWithId(LeaderboardView.leaderboardButtonGlowID)

    leaderboardHeaderBoxWrapper.appendChild(leaderboardHeaderBox)
    const title = createElWithText('h2', 'KONIEC GRY')
    const subtitle = createElWithText('h4', 'WYNIKI')
    leaderboardHeaderBox.append(title, subtitle)

    leaderboardTitleBoxWrapper.appendChild(leaderboardTitleBox)
    leaderboardTitleBox.append(createIcon('/assets/starCustomIcon.png'), leaderboardHeaderBoxWrapper, createIcon('/assets/starCustomIcon.png'))

    leaderboardContentBoxWrapper.appendChild(leaderboardContentBox)
    leaderboardContentBox.appendChild(scrollBox)
    let counter = 0
    let toAdd = 1
    let lastMoney = -1
    status.playersLeaderboard.forEach((el) => {
      if (lastMoney !== el.money) {
        counter = counter + toAdd
        toAdd = 1
      } else {
        toAdd = toAdd + 1
      }

      const rowWrapper = document.createElement('div')
      const row = document.createElement('div')
      if (el.playerId === playerId) {
        row.style.backgroundColor = '#D39F59'
      }
      const leftSide = document.createElement('div')
      const rightSide = document.createElement('div')

      if (counter < 4) {
        const position = document.createElement('img')
        position.id = 'playerPositionTOP3'
        if (counter === 1) {
          position.src = '/assets/firstPlaceCustomIcon.png'
        } else if (counter === 2) {
          position.src = '/assets/secondPlaceCustomIcon.png'
        } else {
          position.src = '/assets/thirdPlaceCustomIcon.png'
        }
        leftSide.appendChild(position)
      } else {
        const position = createDivWithId('playerPosition')
        position.innerText = counter.toString()
        leftSide.appendChild(position)
      }
      const name = createElWithText('h6', el.playerId)
      leftSide.appendChild(name)

      const money = createElWithText('h6', el.money.toString())
      const coin = createIconWithWidth('/assets/coinCustomIcon.png', '30px')
      rightSide.append(coin, money)

      row.append(leftSide, rightSide)
      rowWrapper.appendChild(row)
      scrollBox.appendChild(rowWrapper)

      lastMoney = el.money
    })

    leaderboardButtonGlow.appendChild(leaderboardButtonWrapper)
    leaderboardButtonWrapper.appendChild(leaderboardButton)
    leaderboardButton.innerText = 'Zakończ'
    leaderboardButton.addEventListener('click', () => {
      destroy()
      window.location.href = '/home'
    })

    this.leaderboard.append(leaderboardTitleBoxWrapper, leaderboardContentBoxWrapper, leaderboardButtonGlow)
  }

  public show(): void {
    window.document.body.appendChild(this.leaderboard)
  }

  public close(): void {
    document.getElementById(LeaderboardView.leaderboardID)?.remove()
  }
}
