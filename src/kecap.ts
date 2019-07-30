abstract class Kecap extends HTMLElement {
  /** 아이템 엘리먼트 배열 */
  private items: HTMLElement[] = []

  /** Kecap 엘리먼트 */
  private viewport: HTMLElement

  /** 선택한 엘리먼트 행 위치 */
  public row = 0

  /** 선택한 엘리먼트 열 위치 */
  public col = 0

  /** 보여지는 아이템 그리드 행 위치 */
  public viewRow = 0

  /** 보여지는 아이템 그리드 열 위치 */
  public viewCol = 0

  /** 아이템 사이 간격(px) */
  public margin = Number(this.getAttribute('margin')) // Default: 0

  /** 미리 로딩할 엘리먼트 칸 수 */
  public preloadLimit = Number(this.getAttribute('preload')) || 1

  /** 전체 아이템 그리드 행 크기 */
  public itemRow = Number(this.getAttribute('itemRow')) || 5

  /** 전체 아이템 그리드 열 크기 */
  public itemCol = Number(this.getAttribute('itemCol')) || 5

  /** 보여지는 아이템 그리드 행 크기 */
  public viewportRow = Number(this.getAttribute('viewportRow')) || 3

  /** 보여지는 아이템 그리드 열 크기 */
  public viewportCol = Number(this.getAttribute('viewportCol')) || 3

  public constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const viewport = document.createElement('div')
    viewport.classList.add('kecap')
    const grid = document.createElement('div')
    grid.classList.add('kecap-grid')
    const slot = document.createElement('slot')
    slot.classList.add('kecap-item')
    grid.appendChild(slot)
    viewport.appendChild(grid)
    shadowRoot.appendChild(viewport)
    this.items = this.shadowRoot!
      .querySelector('slot')!
      .assignedElements() as HTMLElement[]
    const maxWidth = Math.max(...this.items.map((item: HTMLElement): number => item.offsetWidth))
    const maxHeight = Math.max(...this.items.map((item: HTMLElement): number => item.offsetHeight))
    viewport.style.cssText = `
      width: ${maxWidth * (this.viewportCol) + this.margin * (this.viewportCol - 1)}px;
      height: ${maxHeight * (this.viewportRow) + this.margin * (this.viewportRow - 1)}px;
      overflow: hidden;
      white-space: nowrap;
    `
    this.viewport = viewport
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${this.itemCol}, ${maxWidth}px);
      grid-gap: ${this.margin}px;
    `
  }

  public connectedCallback(): void {
    const startRow = Math.max(this.viewRow - this.preloadLimit, 0)
    const endRow = Math.min(this.viewRow + this.viewportRow + this.preloadLimit, this.itemRow)
    const startCol = Math.max(this.viewCol - this.preloadLimit, 0)
    const endCol = Math.min(this.viewCol + this.viewportCol + this.preloadLimit, this.itemCol)
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col]
        this._onItemPrepared(item)
      }
    }
    this._onItemSelected(this.selectedItem)
    window.addEventListener('keydown', this._onKeyDown.bind(this))
  }

  public disconnectedCallback(): void {
    window.removeEventListener('keydown', this._onKeyDown)
  }

  private _onItemPrepared(element: HTMLElement): void {
    element.classList.add('ready')
  }

  private _onItemSelected(element: HTMLElement): void {
    element.classList.add('select')
  }

  private _onItemUnselected(element: HTMLElement): void {
    element.classList.remove('select')
  }

  private _onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.selectAbove()
        break
      case 'ArrowDown':
        this.selectBelow()
        break
      case 'ArrowLeft':
        this.selectLeft()
        break
      case 'ArrowRight':
        this.selectRight()
        break
      default:
    }
  }

  /**
   * 현재 선택된 아이템
   */
  public get selectedItem(): HTMLElement {
    return this.items[this.row * this.itemCol + this.col]
  }

  /**
   * 현재 선택된 아이템
   */
  public set selectedItem(item: HTMLElement) {
    throw new Error('not implemented')
  }

  /**
   * 그리드에 엘리먼트를 추가합니다.
   * @param element
   */
  public addElement(element: HTMLElement): void {
    this.items.push(element)
  }

  /**
   * 그리드에 엘리먼트를 추가합니다.
   * @param elements
   */
  public addElements(elements: HTMLElement[]): void {
    this.items = this.items.concat(elements)
  }

  /**
  * 보여지는 화면을 위로 움직일 수 있는지 확인합니다.
  */
  public abstract checkScrollAbove(): boolean

  /**
   * 보여지는 화면을 아래로 움직일 수 있는지 확인합니다.
   */
  public abstract checkScrollBelow(): boolean

  /**
   * 보여지는 화면을 왼쪽으로 움직일 수 있는지 확인합니다.
   */
  public abstract checkScrollLeft(): boolean

  /**
   * 보여지는 화면을 오른쪽으로 움직일 수 있는지 확인합니다.
   */
  public abstract checkScrollRight(): boolean

  /**
   * 보여지는 화면 위쪽 아이템을 미리 로딩합니다.
   */
  private preloadAbove(): void {
    const startRow = Math.max(this.viewRow - this.preloadLimit, 0)
    const endRow = this.viewRow
    const startCol = Math.max(this.viewCol - this.preloadLimit, 0)
    const endCol = this.viewCol + this.viewportCol + this.preloadLimit
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col]
        if (item) {
          this._onItemPrepared(item)
        }
      }
    }
  }

  /**
   * 보여지는 화면 아래쪽 아이템을 미리 로딩합니다.
   */
  private preloadBelow(): void {
    const startRow = this.viewRow + this.viewportRow
    const endRow = Math.min(this.viewRow + this.viewportRow + this.preloadLimit, this.itemRow)
    const startCol = Math.max(this.viewCol - this.preloadLimit, 0)
    const endCol = this.viewCol + this.viewportCol + this.preloadLimit
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col]
        if (item) {
          this._onItemPrepared(item)
        }
      }
    }
  }

  /**
   * 보여지는 화면 왼쪽 아이템을 미리 로딩합니다.
   */
  private preloadLeft(): void {
    const startRow = Math.max(this.viewRow - this.preloadLimit, 0)
    const endRow = this.viewRow + this.viewportRow + this.preloadLimit
    const startCol = Math.max(this.viewCol - this.preloadLimit, 0)
    const endCol = this.viewCol
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col]
        if (item) {
          this._onItemPrepared(item)
        }
      }
    }
  }

  /**
   * 보여지는 화면 오른쪽 아이템을 미리 로딩합니다.
   */
  private preloadRight(): void {
    const startRow = Math.max(this.viewRow - this.preloadLimit, 0)
    const endRow = this.viewRow + this.viewportRow + this.preloadLimit
    const startCol = this.viewCol + this.viewportCol
    const endCol = Math.min(this.viewCol + this.viewportCol + this.preloadLimit, this.itemCol)
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col]
        if (item) {
          this._onItemPrepared(item)
        }
      }
    }
  }

  /**
   * X축 방향으로 화면을 스크롤합니다.
   */
  private scrollX(): void {
    const left = this.items[this.viewCol + this.itemCol * this.viewRow].offsetLeft
      - this.viewport.offsetLeft
    this.viewport.scrollTo({
      left,
      behavior: 'smooth',
    })
  }

  /**
   * Y축 방향으로 화면을 스크롤합니다.
   */
  private scrollY(): void {
    const top = this.items[this.viewCol + this.itemCol * this.viewRow].offsetTop
      - this.viewport.offsetTop
    this.viewport.scrollTo({
      top,
      behavior: 'smooth',
    })
  }

  /**
   * 현재 위치에서 위쪽 아이템을 선택합니다.
   */
  public selectAbove(): void {
    if (this.row > 0) {
      this._onItemUnselected(this.selectedItem)
      this.row -= 1
      this._onItemSelected(this.selectedItem)
    }
    if (this.checkScrollAbove()) {
      this.viewRow -= 1
      this.scrollY()
    }
    this.preloadAbove()
  }

  /**
   * 현재 위치에서 아래쪽 아이템을 선택합니다.
   */
  public selectBelow(): void {
    if (this.row < this.itemRow - 1) {
      this._onItemUnselected(this.selectedItem)
      this.row += 1
      this._onItemSelected(this.selectedItem)
    }
    if (this.checkScrollBelow()) {
      this.viewRow += 1
      this.scrollY()
    }
    this.preloadBelow()
  }

  /**
   * 현재 위치에서 왼쪽 아이템을 선택합니다.
   */
  public selectLeft(): void {
    if (this.col > 0) {
      this._onItemUnselected(this.selectedItem)
      this.col -= 1
      this._onItemSelected(this.selectedItem)
    }
    if (this.checkScrollLeft()) {
      this.viewCol -= 1
      this.scrollX()
    }
    this.preloadLeft()
  }

  /**
   * 현재 위치에서 오른쪽 아이템을 선택합니다.
   */
  public selectRight(): void {
    if (this.col < this.itemCol - 1) {
      this._onItemUnselected(this.selectedItem)
      this.col += 1
      this._onItemSelected(this.selectedItem)
    }
    if (this.checkScrollRight()) {
      this.viewCol += 1
      this.scrollX()
    }
    this.preloadRight()
  }
}

class KecapA extends Kecap {
  public checkScrollAbove(): boolean {
    return this.viewRow > 0
  }

  public checkScrollBelow(): boolean {
    return this.viewRow + this.viewportRow < this.itemRow
  }

  public checkScrollLeft(): boolean {
    return this.viewCol > 0
  }

  public checkScrollRight(): boolean {
    return this.viewCol + this.viewportCol < this.itemCol
  }
}

class KecapB extends Kecap {
  public checkScrollAbove(): boolean {
    return this.viewRow > 0 && this.row === this.viewRow - 1
  }

  public checkScrollBelow(): boolean {
    return this.viewRow + this.viewportRow < this.itemRow
      && this.row === this.viewRow + this.viewportRow
  }

  public checkScrollLeft(): boolean {
    return this.viewCol > 0 && this.col === this.viewCol - 1
  }

  public checkScrollRight(): boolean {
    return this.viewCol + this.viewportCol < this.itemCol
      && this.col === this.viewCol + this.viewportCol
  }
}

customElements.define('kecap-a', KecapA)
customElements.define('kecap-b', KecapB)
