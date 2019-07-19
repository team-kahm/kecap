import { ItemManager } from './manager'

export interface ScrollDimension {
  left: number
  right: number
  top: number
  bottom: number
}

export class Item {
  public elem: HTMLElement

  public index: number

  public attached: boolean

  public manager: ItemManager

  private _selected: boolean

  public constructor(element: HTMLElement, manager: ItemManager, index: number) {
    this.elem = element
    this.index = index

    this.attached = false
    this._selected = false

    this.manager = manager
  }

  public attach(direction: number): void {
    if (direction > 0) {
      this.manager.elem.append(this.elem)
    } else {
      this.manager.elem.prepend(this.elem)
    }

    this.attached = true
  }

  public detach(): void {
    this.manager.elem.removeChild(this.elem)
    this.attached = false
  }

  public update(updateDirection: number, visibleRange: [number, number]): void {
    if (visibleRange[0] <= this.index && this.index < visibleRange[1]) {
      if (!this.attached) {
        this.attach(updateDirection)
      }
    } else if (this.attached) {
      this.detach()
    }
  }

  public get scrollDimension(): ScrollDimension {
    const { width, height } = this.elem.getBoundingClientRect()

    return {
      left: this.elem.offsetLeft,
      right: this.elem.offsetLeft + width,
      top: this.elem.offsetTop,
      bottom: this.elem.offsetTop + height,
    }
  }

  public get selected(): boolean {
    return this._selected
  }

  public set selected(selected: boolean) {
    const original: boolean = this.selected
    if ((original && selected) || (!original && !selected)) return

    if (selected) {
      this.elem.classList.add(this.manager.option.selectedClass)
    } else {
      this.elem.classList.remove(this.manager.option.selectedClass)
    }

    this._selected = selected
  }
}
