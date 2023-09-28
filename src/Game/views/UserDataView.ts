export class UserDataView {
  public static readonly userDataBoxID = 'userDataBox'

  private readonly userDataBox: HTMLDivElement
  private readonly userName: HTMLHeadingElement
  private readonly userClassName: HTMLHeadingElement

  constructor(userName: string, userClassName: string) {
    this.userDataBox = document.createElement('div')
    this.userDataBox.id = UserDataView.userDataBoxID

    this.userName = document.createElement('h1')
    this.userName.innerText = userName

    this.userClassName = document.createElement('h2')
    this.userClassName.innerText = userClassName

    this.userDataBox.appendChild(this.userName)
    this.userDataBox.appendChild(this.userClassName)
  }

  public show(): void {
    if (!document.getElementById(UserDataView.userDataBoxID)) {
      window.document.body.appendChild(this.userDataBox)
    }
  }

  public close(): void {
    document.getElementById(UserDataView.userDataBoxID)?.remove()
  }
}
