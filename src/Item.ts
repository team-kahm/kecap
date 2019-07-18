import ItemManager from "./ItemManager";

interface ScrollDimension {
  left: number,
  right: number,
  top: number,
  bottom: number
};

class Item {
  elem: Element;
  index: number;
  attached: boolean;
  manager: ItemManager;

  private _selected: boolean;

  constructor(element: Element, manager: ItemManager, index: number) {
    this.elem = element;
    this.index = index;

    this.attached = false;
    this._selected = false;

    this.manager = manager;
  }

  attach(direction: number) {
    if(direction > 0) {
      this.manager.elem.append(this.elem);
    } else {
      this.manager.elem.prepend(this.elem);
    }

    this.attached = true;
  }

  detach() {
    this.manager.elem.removeChild(this.elem);
    this.attached = false;
  }

  update(updateDirection: number, visibleRange: [number, number]) {
    if(visibleRange[0] <= this.index && this.index < visibleRange[1]) {
      if(!this.attached) {
        this.attach(updateDirection);
      }
    } else {
      if(this.attached) {
        this.detach();
      }
    }
  }

  get scrollDimension() : ScrollDimension {
    const {width: number, height: number} = this.elem.getBoundingClientRect();

    return {
      left: this.elem.offsetLeft,
      right: this.elem.offsetLeft + width,
      top: this.elem.offsetTop,
      bottom: this.elem.offsetTop + height
    };
  }

  get selected() : boolean {
    return this._selected;
  }

  set selected(selected : boolean) {
    const original: boolean = this.selected;

    if((original && selected) || (!original && !selected)) {
      return;
    }

    if(selected) {
      this.elem.classList.add(this.manager.option.selectedClass);
    } else {
      this.elem.classList.remove(this.manager.option.selectedClass);
    }

    this._selected = selected;
  }
}

export default Item;
