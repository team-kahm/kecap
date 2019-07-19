import { Item, ScrollDimension } from './item'

export enum EnumDirection {
  DIRECTION_X,
  DIRECTION_Y
}
export interface ItemManagerOptions {
  lazyload: number
  selectedClass: string
  itemRow: number
  itemCol: number
  viewportRow: number
  viewportCol: number
  direction: EnumDirection
}

export class ItemManager {
  public elem: HTMLElement

  public items: Item[]

  public option: ItemManagerOptions

  public x: number

  public y: number

  private isXDir: boolean

  public constructor(element: HTMLElement, option?: Partial<ItemManagerOptions>) {
    this.items = []
    this.elem = element
    this.option = {
      lazyload: 20,
      selectedClass: 'selected',
      itemRow: 10,
      itemCol: 10,
      viewportRow: 3,
      viewportCol: 3,
      direction: EnumDirection.DIRECTION_X,
    }

    this.x = 0
    this.y = 0

    if (option) Object.assign(this.option, option)

    this.isXDir = this.option.direction === EnumDirection.DIRECTION_X
    this.addElements(Array.from(this.elem.children[0].children) as HTMLElement[])
  }

  public addElements(elements: HTMLElement[]): void {
    this.addItems(elements.map((elem: HTMLElement, index: number): Item => {
      const item: Item = new Item(elem, this, this.items.length + index)
      item.attached = true

      return item
    }))
  }

  public addItems(items: Item[]): void {
    this.items = this.items.concat(items)
    this.updateItems(items)
  }

  public updateItems(items = this.items, updateDirection = 1, updateIndex = false): void {
    const targets = updateDirection > 0 ? items : items.reverse()

    const visibleRange: [number, number] = [
      ((this.isXDir ? this.x : this.y) - this.option.lazyload) * this.itemSize,
      ((this.isXDir ? this.x : this.y) + this.option.lazyload) * this.itemSize,
    ]

    targets.forEach((item): void => {
      item.update(updateDirection, visibleRange)
    })

    if (updateIndex) {
      for (let i = 0; i < this.items.length; i += 1) {
        if (targets.includes(this.items[i])) this.items[i].index = i
      }
    }
  }

  private getIndex(x: number, y: number): number {
    if (this.isXDir) return x * this.itemSize + y

    return y * this.itemSize + x
  }

  private scrollNotIfVisible(dimension: ScrollDimension): void {
    const { width, height } = this.elem.getBoundingClientRect()
    const { scrollTop } = this.elem
    const { scrollLeft } = this.elem

    let xCoord = -1
    let yCoord = -1

    if (scrollTop < dimension.top) {
      yCoord = dimension.top
    } else if (scrollTop + height < dimension.bottom) {
      yCoord = dimension.bottom - height
    }

    if (scrollLeft < dimension.left) {
      xCoord = dimension.left - width
    } else if (scrollLeft + width < dimension.right) {
      xCoord = dimension.right
    }

    if (xCoord >= 0 || yCoord >= 0) {
      this.elem.scrollTo({
        top: yCoord >= 0 ? yCoord : undefined,
        left: xCoord >= 0 ? xCoord : undefined,
        behavior: 'smooth',
      })
    }
  }

  private select(x: number, y: number): void {
    const checkDirection: number = this.isXDir ? x : y
    if (checkDirection <= 0 || this.itemSize <= checkDirection) return

    const index: number = this.getIndex(x, y)
    if (index <= 0 || this.items.length <= index) return

    this.items[this.getIndex(this.x, this.y)].selected = false
    this.items[index].selected = true

    const deltaDirection: number = this.isXDir ? x - this.x : y - this.y

    this.x = x
    this.y = y

    const { scrollDimension } = this.items[index]
    this.scrollNotIfVisible(scrollDimension)

    if (deltaDirection === 0) return

    let edgeItems: Item[] = []
    const directionValue: number = (this.isXDir ? this.x : this.y)

    const foreValue: number = directionValue - this.option.lazyload
    edgeItems = edgeItems.concat(this.items.slice(
      Math.max(0, foreValue * this.itemSize - this.itemSize),
      this.itemSize,
    ))

    const backValue: number = directionValue + this.option.lazyload
    edgeItems = edgeItems.concat(this.items.slice(
      Math.min(this.items.length, backValue * this.itemSize),
      this.itemSize,
    ))

    this.updateItems(edgeItems, deltaDirection)
  }

  public selectAbove(): void {
    this.select(this.x, this.y - 1)
  }

  public selectBelow(): void {
    this.select(this.x, this.y + 1)
  }

  public selectLeft(): void {
    this.select(this.x - 1, this.y)
  }

  public selectRight(): void {
    this.select(this.x + 1, this.y)
  }

  public get viewportSize(): number {
    if (this.isXDir) {
      return this.option.viewportCol
    }
    return this.option.viewportRow
  }

  public set viewportSize(viewportSize: number) {
    if (this.isXDir) {
      this.option.viewportCol = viewportSize
    } else {
      this.option.viewportRow = viewportSize
    }
  }

  public get itemSize(): number {
    if (this.isXDir) {
      return this.option.itemCol
    }
    return this.option.itemRow
  }

  public set itemSize(itemSize: number) {
    if (this.isXDir) {
      this.option.itemCol = itemSize
    } else {
      this.option.itemRow = itemSize
    }
  }
}
