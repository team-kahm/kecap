import { Item, ScrollDimension } from './item'

function sum(nums: number[]): number {
  return nums.reduce((acc, cur): number => acc + cur, 0)
}

export enum ScrollBehavior {
  TYPE_A,
  TYPE_B
}

export interface ItemManagerOptions {
  /** 미리 로딩할 엘리먼트 칸 수 */
  preload: number
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
  public preload = 1

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
    this.addElements(Array.from(this.element.children[0].children) as HTMLElement[])
  }

  /**
   * 그리드에 엘리먼트를 추가합니다.
   * @param element
   */
  public addElement(element: HTMLElement): void {
    this.addItem(new Item(element, this))
  }

  /**
   * 그리드에 엘리먼트를 추가합니다.
   * @param elements
   */
  public addElements(elements: HTMLElement[]): void {
    this.addItems(elements.map((element): Item => new Item(element, this)))
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

  private scrollAbove(): void {
    if (this.viewRow > 0) {
      switch (this.strategy) {
        case ScrollBehavior.TYPE_A:
          this.viewRow -= 1
          const topElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) < this.viewRow && index % this.itemCol === this.viewCol)
          const top = sum(topElements.map(item => item.elem.offsetHeight))
          this.element.scrollTo({
            top,
            behavior: 'smooth',
          })
          break;
        case ScrollBehavior.TYPE_B:
          if (this.row === this.viewRow - 1) {
            this.viewRow -= 1
            const topElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) < this.viewRow && index % this.itemCol === this.viewCol)
            const top = sum(topElements.map(item => item.elem.offsetWidth))
            this.element.scrollTo({
              top,
              behavior: 'smooth',
            })
          }
          break;
        default:
          throw new Error('Unknown scroll behavior')
      }
    } else {
      console.log('top edge')
    }
  }

  private scrollBelow(): void {
    if (this.viewRow + this.viewportRow < this.itemRow) {
      switch (this.strategy) {
        case ScrollBehavior.TYPE_A:
          this.viewRow += 1
          const topElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) < this.viewRow && index % this.itemCol === this.viewCol)
          const top = sum(topElements.map(item => item.elem.offsetWidth))
          this.element.scrollTo({
            top,
            behavior: 'smooth',
          })
          break;
        case ScrollBehavior.TYPE_B:
          if (this.row === this.viewRow + this.viewportRow) {
            this.viewRow += 1
            const topElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) < this.viewRow && index % this.itemCol === this.viewCol)
            const top = sum(topElements.map(item => item.elem.offsetWidth))
            this.element.scrollTo({
              top,
              behavior: 'smooth',
            })
          }
          break;
        default:
          throw new Error('Unknown scroll behavior')
      }
    } else {
      console.log('bottom edge')
    }
  }

  private scrollLeft(): void {
    if (this.viewCol > 0) {
      switch (this.strategy) {
        case ScrollBehavior.TYPE_A:
          this.viewCol -= 1
          const leftElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) === this.viewRow && index % this.itemCol < this.viewCol)
          const left = sum(leftElements.map(item => item.elem.offsetHeight))
          this.element.scrollTo({
            left,
            behavior: 'smooth',
          })
          break;
        case ScrollBehavior.TYPE_B:
          if (this.col === this.viewCol - 1) {
            this.viewCol -= 1
            const leftElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) === this.viewRow && index % this.itemCol < this.viewCol)
            const left = sum(leftElements.map(item => item.elem.offsetHeight))
            this.element.scrollTo({
              left,
              behavior: 'smooth',
            })
          }
          break;
        default:
          throw new Error('Unknown scroll behavior')
      }
    } else {
      console.log('top edge')
    }
  }

  private scrollRight(): void {
    if (this.viewCol + this.viewportCol < this.itemCol) {
      switch (this.strategy) {
        case ScrollBehavior.TYPE_A:
          this.viewCol += 1
          const leftElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) === this.viewRow && index % this.itemCol < this.viewCol)
          const left = sum(leftElements.map(item => item.elem.offsetHeight))
          this.element.scrollTo({
            left,
            behavior: 'smooth',
          })
          break;
        case ScrollBehavior.TYPE_B:
          if (this.col === this.viewCol + this.viewportCol) {
            this.viewCol += 1
            const leftElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) === this.viewRow && index % this.itemCol < this.viewCol)
            const left = sum(leftElements.map(item => item.elem.offsetHeight))
            this.element.scrollTo({
              left,
              behavior: 'smooth',
            })
          }
          break;
        default:
          throw new Error('Unknown scroll behavior')
      }
    } else {
      console.log('right edge')
    }
  }

  /**
   * 현재 위치에서 위쪽 아이템을 선택합니다.
   */
  public selectAbove(): void {
    if (this.row > 0) {
      this.items[this.row * this.itemCol + this.col].unselect()
      this.row -= 1
      this.items[this.row * this.itemCol + this.col].select()
    }
    this.scrollAbove()
  }

  /**
   * 현재 위치에서 아래쪽 아이템을 선택합니다.
   */
  public selectBelow(): void {
    if (this.row < this.itemRow - 1) {
      this.items[this.row * this.itemCol + this.col].unselect()
      this.row += 1
      this.items[this.row * this.itemCol + this.col].select()
    }
    this.scrollBelow()
  }

  /**
   * 현재 위치에서 왼쪽 아이템을 선택합니다.
   */
  public selectLeft(): void {
    if (this.col > 0) {
      this.items[this.row * this.itemCol + this.col].unselect()
      this.col -= 1
      this.items[this.row * this.itemCol + this.col].select()
    }
    this.scrollLeft()
  }

  /**
   * 현재 위치에서 오른쪽 아이템을 선택합니다.
   */
  public selectRight(): void {
    if (this.col < this.itemCol - 1) {
      this.items[this.row * this.itemCol + this.col].unselect()
      this.col += 1
      this.items[this.row * this.itemCol + this.col].select()
    }
    this.scrollRight()
  }
}
