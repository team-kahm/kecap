import { ItemManager } from './manager'

export class Item {
  public elem: HTMLElement

  public index: number

  public attached: boolean

  public manager: ItemManager

  private _selected: boolean

  public constructor(element: HTMLElement, manager: ItemManager, index?: number) {
    this.elem = element
    this.index = index || -1

    this.attached = false
    this._selected = false

    this.manager = manager
  }

  public unselect(): void {
    this.elem.classList.remove('select')
  }

  public select(): void {
    this.elem.classList.add('select')
  }

  public load(): void{
    this.elem.classList.add('ready')
  }
}
