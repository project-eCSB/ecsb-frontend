import {
  createDivWithId,
  createElWithText,
  createElWithIdText,
  createIconWithWidth,
} from './ViewUtils'

export class LobbyView {
  public static readonly lobbyID = 'lobby'
  public static readonly lobbyLogoID = 'lobbyLogo'
  public static readonly lobbyLogoWrapperID = 'lobbyLogoWrapper'
  public static readonly lobbyInfoID = 'lobbyInfo'
  public static readonly lobbyInfoWrapperID = 'lobbyInfoWrapper'
  public static readonly lobbyInfoLabelID = 'lobbyInfoLabel'
  public static readonly lobbyInfoCounterID = 'lobbyInfoConter'
  public static readonly lobbyGameStateID = 'lobbyGameState'
  public static readonly lobbyGameStateWrapperID = 'lobbyGameStateWrapper'

  private readonly lobby: HTMLDivElement
  private readonly lobbyInfoCounter: HTMLHeadingElement
  private readonly lobbyMessage: HTMLHeadingElement

  constructor(amount: number, total: number) {
    this.lobby = createDivWithId(LobbyView.lobbyID)
    const lobbyLogoImg = createIconWithWidth('/assets/logo.png', '180px')
    const lobbyLogo = createDivWithId(LobbyView.lobbyLogoID)
    lobbyLogo.appendChild(lobbyLogoImg)

    const lobbyLogoWrapper = createDivWithId(LobbyView.lobbyLogoWrapperID)
    lobbyLogoWrapper.appendChild(lobbyLogo)

    const lobbyInfoLabel = createElWithIdText('h2', LobbyView.lobbyInfoLabelID, 'Ilość graczy:')
    this.lobbyInfoCounter = createElWithIdText('h1', LobbyView.lobbyInfoCounterID, `${amount}/${total}`) as HTMLHeadingElement

    const lobbyInfo = createDivWithId(LobbyView.lobbyInfoID)
    lobbyInfo.append(lobbyInfoLabel,this.lobbyInfoCounter)

    const lobbyInfoWrapper = createDivWithId(LobbyView.lobbyInfoWrapperID)
    lobbyInfoWrapper.appendChild(lobbyInfo)

    this.lobbyMessage = createElWithText('h2',
      amount >= total
        ? 'Gra rozpocznie się za kilka sekund.'
        : 'Gra rozpocznie się po dołączeniu wszystkich graczy.') as HTMLHeadingElement
    this.lobbyMessage.style.color = amount >= total ? '#677818' : '#000000'

    const lobbyGameState = createDivWithId(LobbyView.lobbyGameStateID)
    lobbyGameState.appendChild(this.lobbyMessage)

    const lobbyGameStateWrapper = createDivWithId(LobbyView.lobbyGameStateWrapperID)
    lobbyGameStateWrapper.appendChild(lobbyGameState)

    this.lobby.append(lobbyLogoWrapper, lobbyInfoWrapper, lobbyGameStateWrapper)
  }

  public update(amount: number, total: number): void {
    this.lobbyInfoCounter.innerText = `${amount}/${total}`

    this.lobbyMessage.innerText =
      amount >= total
        ? 'Gra rozpocznie się za kilka sekund.'
        : 'Gra rozpocznie się po dołączeniu wszystkich graczy.'
    this.lobbyMessage.style.color = amount >= total ? '#677818' : '#000000'
  }

  public show(): void {
    if (!document.getElementById(LobbyView.lobbyID)) {
      window.document.body.appendChild(this.lobby)
    }
  }

  public close(): void {
    document.getElementById(LobbyView.lobbyID)?.remove()
  }
}
