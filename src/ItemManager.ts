enum EnumDirection {
  DIRECTION_X,
  DIRECTION_Y
}

interface ItemManagerOptions {
  lazyload?: number,
  selectedClass?: string,
  itemRow?: number,
  itemCol?: number,
  viewportRow?: number,
  viewportCol?: number,
  direction?: EnumDirection
}

class ItemManager {
  elem: Element;
  items: Item[];
  option: ItemManagerOptions;
  x: number;
  y: number;

  private isXDir: boolean;

  constructor(element: Element, option?: ItemManagerOptions) {
    this.items = [];
    this.elem = element;
    this.addElements([...this.elem.children]);
    this.option = {
      lazyload: 20,
      selectedClass: 'selected',
      itemRow: 10,
      itemCol: 10,
      viewportRow: 3,
      viewportCol: 3,
      direction: EnumDirection.DIRECTION_X
    };

    this.x = 0;
    this.y = 0;

    if(option) Object.assign(this.option, option);

    this.isXDir = this.option.direction === EnumDirection.DIRECTION_X;
  }

  addElements(elements: Element[]) {
    return this.addItems(elements.map((elem: Element, index: number) => {
      const item: Item = new Item(elem, this, this.items.length + index)
      item.attached = true;

      return item;
    }));
  }

  addItems(items: Item[]) {
    this.items = this.items.concat(items);
    this.updateItems(items);
  }

  updateItems(items?: Item[], updateDirection: number = 1, updateIndex: boolean = false) {
    if(!items) {
      items = this.items;
    }

    if(updateDirection > 0) {
      items = items.reverse();
    }

    const visibleRange: [number, number] = [
      ((this.isXDir ? this.x : this.y) - this.option.lazyload) * this.itemSize,
      ((this.isXDir ? this.x : this.y) + this.option.lazyload) * this.itemSize
    ];

    items.forEach(item: Item => {
      item.update(updateDirection, visibleRange);
    });

    if(updateIndex) {
      for(let index in this.items) {
        if(items.includes(this.items[index])) this.items[index].index = index;
      }
    }
  }

  private getIndex(x: number, y: number) : number {
    if(this.isXDir) return x * this.itemSize + y;

    return y * this.itemSize + x;
  }

  private scrollNotIfVisible(dimension: ScrollDimension) {
    const {width: number, height: number} = this.elem.getBoundingClientRect();
    const scrollTop: number = this.elem.scrollTop;
    const scrollLeft: number = this.elem.scrollLeft;

    let xCoord: number, yCoord: number;

    if(scrollTop < dimension.top) {
      yCoord = dimension.top;
    } else if (scrollTop + height < dimension.bottom) {
      yCoord = dimension.bottom - height;
    }

    if(scrollLeft < dimension.left) {
      xCoord = dimension.left;
    } else if (scrollLeft + width < dimension.right) {
      xCoord = dimension.right - width;
    }

    if(xCoord !== undefined || yCoord !== undefined)
      this.elem.scrollTo({
        top: yCoord,
        left: xCoord,
        behavior: 'smooth'
      });
  }

  private select(x : number, y : number) {
    const checkDirection : number = this.isXDir ? y : x;
    if(checkDirection <= 0 || this.itemSize <= checkDirection) return;

    const index : number = this.getIndex(x, y);
    if(index <= 0 || this.items.length <= index) return;

    this.items[this.getIndex(this.x, this.y)].selected = false;
    this.items[index].selected = true;

    const deltaDirection : number = this.isXDir ? x - this.x : y - this.y;

    this.x = x;
    this.y = y;

    const scrollDimension: ScrollDimension = this.items[index].scrollDimension;
    this.scrollNotIfVisible(scrollDimension);

    if(deltaDirection === 0) return;

    let edgeItems: Item[] = [];
    const directionValue: number = (this.isXDir ? this.x : this.y);

    const foreValue: number = directionValue - this.option.lazyload;
    edgeItems = edgeItems.concat(this.items.slice(
      Math.max(0, foreValue * this.itemSize - this.itemSize),
      this.itemSize
    ));

    const backValue: number = directionValue + this.option.lazyload;
    edgeItems = edgeItems.concat(this.items.slice(
      Math.min(this.items.length, backValue * this.itemSize),
      this.itemSize
    ));

    this.updateItems(edgeItems, deltaDirection);
  }

  selectAbove() {
    this.select(this.x, this.y - 1);
  }

  selectBelow() {
    this.select(this.x, this.y - 1);
  }

  selectLeft() {
    this.select(this.x - 1, this.y);
  }

  selectRight() {
    this.select(this.x + 1, this.y);
  }

  get viewportSize() : number {
    if(this.isXDir) {
      return this.option.viewportCol;
    } else {
      return this.option.viewportRow;
    }
  }

  set viewportSize(viewportSize: number) {
    if(this.isXDir) {
      this.option.viewportCol = viewportSize;
    } else {
      this.option.viewportRow = viewportSize;
    }
  }

  get itemSize() : number {
    if(this.isXDir) {
      return this.option.itemCol;
    } else {
      return this.option.itemRow;
    }
  }

  set itemSize(itemSize: number) {
    if(this.isXDir) {
      this.option.itemCol = itemSize;
    } else {
      this.option.itemRow = itemSize;
    }
  }
}

export default ItemManager;
