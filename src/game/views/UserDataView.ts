import { createDivWithId, createElWithText } from './ViewUtils'

export class UserDataView {
  public static readonly userDataBoxWrapperID = 'userDataBoxWrapper'
  public static readonly userDataBoxID = 'userDataBox'

  private readonly userDataBox: HTMLDivElement
  private readonly userName: HTMLHeadingElement
  private readonly userClassName: HTMLHeadingElement
  private readonly userDataBoxWrapper: HTMLDivElement

  constructor(userName: string, userClassName: string) {
    this.userDataBox = createDivWithId(UserDataView.userDataBoxID)
    this.userName = createElWithText('h1', userName) as HTMLHeadingElement
    this.userClassName = createElWithText('h2', userClassName) as HTMLHeadingElement
    this.userDataBox.append(this.userName, this.userClassName)
    this.userDataBoxWrapper = createDivWithId(UserDataView.userDataBoxWrapperID)
    this.userDataBoxWrapper.appendChild(this.userDataBox)
  }

  public show(): void {
    window.document.body.appendChild(this.userDataBoxWrapper)
  }

  public close(): void {
    document.getElementById(UserDataView.userDataBoxWrapperID)?.remove()
  }
}
