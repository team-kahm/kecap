function sum(nums: number[]): number {
  return nums.reduce((acc, cur): number => acc + cur, 0)
}

export enum ScrollBehavior {
  TYPE_A,
  TYPE_B
}

export class Item {
  public element: HTMLElement

  public constructor(element: HTMLElement) {
    this.element = element
  }

  public unselect(): void {
    this.element.classList.remove('select')
  }

  public select(): void {
    this.element.classList.add('select')
  }

  public load(): void{
    this.element.classList.add('ready')
  }
}

export interface ItemManagerOptions {
  /** 미리 로딩할 엘리먼트 칸 수 */
  preloadLimit: number
  /** 전체 아이템 그리드 행 크기 */
  itemRow: number
  /** 전체 아이템 그리드 열 크기 */
  itemCol: number
  /** 보여지는 아이템 그리드 행 크기 */
  viewportRow: number
  /** 보여지는 아이템 그리드 열 크기 */
  viewportCol: number
  /** 스크롤 작동 방법 */
  strategy: ScrollBehavior
}

export class ItemManager {
  /** 카로셀 그리드 엘리먼트 */
  private element: HTMLElement

  /** 아이템 엘리먼트 배열 */
  private items: Item[]

  /** 미리 로딩할 엘리먼트 칸 수 */
  public preloadLimit = 1

  /** 선택한 엘리먼트 행 위치 */
  private row = 0

  /** 선택한 엘리먼트 열 위치 */
  private col = 0

  /** 전체 아이템 그리드 행 크기 */
  public itemRow = 6

  /** 전체 아이템 그리드 열 크기 */
  public itemCol = 6

  /** 보여지는 아이템 그리드 행 위치 */
  private viewRow = 0

  /** 보여지는 아이템 그리드 열 위치 */
  private viewCol = 0

  /** 보여지는 아이템 그리드 행 크기 */
  public viewportRow = 3

  /** 보여지는 아이템 그리드 열 크기 */
  public viewportCol = 3

  /** 스크롤 작동 방법 */
  public strategy = ScrollBehavior.TYPE_A

  public constructor(element: HTMLElement, options?: Partial<ItemManagerOptions>) {
    this.element = element
    this.items = []
    Object.assign(this, options)

    // 엘리먼트를 아이템으로 변환해 배열에 저장합니다.
    this.addElements(Array.from(this.element.children[0].children) as HTMLElement[])

    // 아이템을 로드합니다.
    const startRow = Math.max(this.viewRow - this.preloadLimit, 0)
    const endRow = Math.min(this.viewRow + this.viewportRow + this.preloadLimit, this.itemRow)
    const startCol = Math.max(this.viewCol - this.preloadLimit, 0)
    const endCol = Math.min(this.viewCol + this.viewportCol + this.preloadLimit, this.itemCol)
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col]
        item.load()
      }
    }
  }

  /**
   * 현재 선택된 아이템
   */
  public get selectedItem(): Item {
    return this.items[this.row * this.itemCol + this.col]
  }

  /**
   * 현재 선택된 아이템
   */
  public set selectedItem(item: Item) {
    throw new Error("not implemented")
  }

  /**
   * 그리드에 엘리먼트를 추가합니다.
   * @param element
   */
  public addElement(element: HTMLElement): void {
    this.addItem(new Item(element))
  }

  /**
   * 그리드에 엘리먼트를 추가합니다.
   * @param elements
   */
  public addElements(elements: HTMLElement[]): void {
    this.addItems(elements.map((element): Item => new Item(element)))
  }

  /**
   * 그리드에 아이템을 추가합니다.
   * @param item
   */
  public addItem(item: Item): void {
    this.items.push(item)
  }

  /**
   * 그리드에 아이템을 추가합니다.
   * @param items
   */
  public addItems(items: Item[]): void {
    this.items = this.items.concat(items)
  }

  /**
   * 보여지는 화면을 위로 움직일 수 있는지 확인합니다.
   */
  private checkScrollAbove(): boolean {
    return this.viewRow > 0 && (
      this.strategy === ScrollBehavior.TYPE_A
      || (this.strategy === ScrollBehavior.TYPE_B && this.row === this.viewRow - 1)
    )
  }

  /**
   * 보여지는 화면을 아래로 움직일 수 있는지 확인합니다.
   */
  private checkScrollBelow(): boolean {
    return this.viewRow + this.viewportRow < this.itemRow && (
      this.strategy === ScrollBehavior.TYPE_A
      || (this.strategy === ScrollBehavior.TYPE_B && this.row === this.viewRow + this.viewportRow)
    )
  }

  /**
   * 보여지는 화면을 왼쪽으로 움직일 수 있는지 확인합니다.
   */
  private checkScrollLeft(): boolean {
    return this.viewCol > 0 && this.col === this.viewCol - 1
  }

  /**
   * 보여지는 화면을 오른쪽으로 움직일 수 있는지 확인합니다.
   */
  private checkScrollRight(): boolean {
    return this.viewCol + this.viewportCol < this.itemCol && (this.col === this.viewCol + this.viewportCol)
  }

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
        item.load()
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
        item.load()
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
        item.load()
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
        item.load()
      }
    }
  }

  /**
   * 보여지는 화면을 위로 움직입니다.
   */
  private scrollAbove(): void {
    this.viewRow -= 1

    //TODO fix
    const top = this.items[this.viewRow * this.itemCol + this.viewCol].element.offsetTop
    this.element.scrollTo({
      top,
      behavior: 'smooth',
    })
  }

  /**
   * 보여지는 화면을 아래로 움직입니다.
   */
  private scrollBelow(): void {
    this.viewRow += 1

    //TODO fix
    const top = this.items[this.viewRow * this.itemCol + this.viewCol - this.viewportCol + 1].element.offsetTop
    this.element.scrollTo({
      top,
      behavior: 'smooth',
    })
  }

  /**
   * 보여지는 화면을 왼쪽으로 움직입니다.
   */
  private scrollLeft(): void {
    this.viewCol -= 1

    const left = this.items[this.viewCol + this.itemCol * this.viewRow].element.offsetLeft - this.element.offsetLeft
    this.element.scrollTo({
      left,
      behavior: 'smooth',
    })
  }

  /**
   * 보여지는 화면을 오른쪽으로 움직입니다.
   */
  private scrollRight(): void {
    this.viewCol += 1

    const left = this.items[this.viewCol + this.itemCol * this.viewRow].element.offsetLeft - this.element.offsetLeft
    this.element.scrollTo({
      left,
      behavior: 'smooth',
    })
  }

  /**
   * 현재 위치에서 위쪽 아이템을 선택합니다.
   */
  public selectAbove(): void {
    if (this.row > 0) {
      this.selectedItem.unselect()
      this.row -= 1
      this.selectedItem.select()
    }
    if (this.checkScrollAbove()) {
      this.scrollAbove()
    }
    this.preloadAbove()
  }

  /**
   * 현재 위치에서 아래쪽 아이템을 선택합니다.
   */
  public selectBelow(): void {
    if (this.row < this.itemRow - 1) {
      this.selectedItem.unselect()
      this.row += 1
      this.selectedItem.select()
    }
    if (this.checkScrollBelow()) {
      this.scrollBelow()
    }
    this.preloadBelow()
  }

  /**
   * 현재 위치에서 왼쪽 아이템을 선택합니다.
   */
  public selectLeft(): void {
    if (this.col > 0) {
      this.selectedItem.unselect()
      this.col -= 1
      this.selectedItem.select()
    }
    if (this.checkScrollLeft()) {
      this.scrollLeft()
    }
    this.preloadLeft()
  }

  /**
   * 현재 위치에서 오른쪽 아이템을 선택합니다.
   */
  public selectRight(): void {
    console.log(this.itemCol)
    if (this.col < this.itemCol - 1) {
      this.selectedItem.unselect()
      this.col += 1
      this.selectedItem.select()
    }
    if (this.checkScrollRight()) {
      this.scrollRight()
    }
    this.preloadRight()
  }
}
