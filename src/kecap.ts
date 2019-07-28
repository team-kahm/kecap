abstract class Kecap extends HTMLElement {
  /** 아이템 엘리먼트 배열 */
  private items: HTMLElement[] = []

  /** 선택한 엘리먼트 행 위치 */
  public row = 0

  /** 선택한 엘리먼트 열 위치 */
  public col = 0

  /** 보여지는 아이템 그리드 행 위치 */
  public viewRow = 0

  /** 보여지는 아이템 그리드 열 위치 */
  public viewCol = 0

  /** 미리 로딩할 엘리먼트 칸 수 */
  public preloadLimit: number

  /** 전체 아이템 그리드 행 크기 */
  public itemRow: number

  /** 전체 아이템 그리드 열 크기 */
  public itemCol: number

  /** 보여지는 아이템 그리드 행 크기 */
  public viewportRow: number

  /** 보여지는 아이템 그리드 열 크기 */
  public viewportCol: number

  public constructor() {
    super();
    this.preloadLimit = Number(this.getAttribute('preload')) || 1;
    this.itemRow = Number(this.getAttribute('itemRow')) || 5;
    this.itemCol = Number(this.getAttribute('itemCol')) || 5;
    this.viewportRow = Number(this.getAttribute('viewportRow')) || 3;
    this.viewportCol = Number(this.getAttribute('viewportCol')) || 3;

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <style>
        :host {
          display: grid;
          grid-template-columns: repeat(${this.itemCol}, 100px);
          grid-gap: 1px;
        }      
      </style>
      <slot name="item"></slot>
    `;
    this.items = this.shadowRoot!
      .querySelector('slot')!
      .assignedElements() as HTMLElement[];
  }

  public connectedCallback() {
    const startRow = Math.max(this.viewRow - this.preloadLimit, 0);
    const endRow = Math.min(this.viewRow + this.viewportRow + this.preloadLimit, this.itemRow);
    const startCol = Math.max(this.viewCol - this.preloadLimit, 0);
    const endCol = Math.min(this.viewCol + this.viewportCol + this.preloadLimit, this.itemCol);
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col];
        this._onItemPrepared(item);
      }
    }
    this._onItemSelected(this.selectedItem);

    window.addEventListener('keydown', this._onKeyDown.bind(this));
  }

  public disconnectedCallback() {
    window.removeEventListener('keydown', this._onKeyDown);
  }

  private _onItemPrepared(element: HTMLElement) {
    console.log('ready', element)
    element.classList.add('ready');
  }

  private _onItemSelected(element: HTMLElement) {
    element.classList.add('select');
  }

  private _onItemUnselected(element: HTMLElement) {
    element.classList.remove('select');
  }

  private _onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.selectAbove();
        break;
      case 'ArrowDown':
        this.selectBelow();
        break;
      case 'ArrowLeft':
        this.selectLeft();
        break;
      case 'ArrowRight':
        this.selectRight();
        break;
    }
  }

  /**
   * 현재 선택된 아이템
   */
  public get selectedItem(): HTMLElement {
    return this.items[this.row * this.itemCol + this.col];
  }

  /**
   * 현재 선택된 아이템
   */
  public set selectedItem(item: HTMLElement) {
    throw new Error('not implemented');
  }

  /**
   * 그리드에 엘리먼트를 추가합니다.
   * @param element
   */
  public addElement(element: HTMLElement): void {
    this.items.push(element);
  }

  /**
   * 그리드에 엘리먼트를 추가합니다.
   * @param elements
   */
  public addElements(elements: HTMLElement[]): void {
    this.items = this.items.concat(elements);
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
    const startRow = Math.max(this.viewRow - this.preloadLimit, 0);
    const endRow = this.viewRow;
    const startCol = Math.max(this.viewCol - this.preloadLimit, 0);
    const endCol = this.viewCol + this.viewportCol + this.preloadLimit;
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col];
        this._onItemPrepared(item);
      }
    }
  }

  /**
   * 보여지는 화면 아래쪽 아이템을 미리 로딩합니다.
   */
  private preloadBelow(): void {
    const startRow = this.viewRow + this.viewportRow;
    const endRow = Math.min(this.viewRow + this.viewportRow + this.preloadLimit, this.itemRow);
    const startCol = Math.max(this.viewCol - this.preloadLimit, 0);
    const endCol = this.viewCol + this.viewportCol + this.preloadLimit;
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col];
        this._onItemPrepared(item);
      }
    }
  }

  /**
   * 보여지는 화면 왼쪽 아이템을 미리 로딩합니다.
   */
  private preloadLeft(): void {
    const startRow = Math.max(this.viewRow - this.preloadLimit, 0);
    const endRow = this.viewRow + this.viewportRow + this.preloadLimit;
    const startCol = Math.max(this.viewCol - this.preloadLimit, 0);
    const endCol = this.viewCol;
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col];
        this._onItemPrepared(item);
      }
    }
  }

  /**
   * 보여지는 화면 오른쪽 아이템을 미리 로딩합니다.
   */
  private preloadRight(): void {
    const startRow = Math.max(this.viewRow - this.preloadLimit, 0);
    const endRow = this.viewRow + this.viewportRow + this.preloadLimit;
    const startCol = this.viewCol + this.viewportCol;
    const endCol = Math.min(this.viewCol + this.viewportCol + this.preloadLimit, this.itemCol);
    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const item = this.items[row * this.itemCol + col];
        this._onItemPrepared(item);
      }
    }
  }

  private scrollX(): void {
    const left = this.items[this.viewCol + this.itemCol * this.viewRow].offsetLeft - this.offsetLeft
    this.scrollTo({
      left,
      behavior: 'smooth',
    })
  }

  private scrollY(): void {
    const top = this.items[this.viewCol + this.itemCol * this.viewRow].offsetTop - this.offsetTop
    this.scrollTo({
      top,
      behavior: 'smooth',
    })
  }

  /**
   * 현재 위치에서 위쪽 아이템을 선택합니다.
   */
  public selectAbove(): void {
    if (this.row > 0) {
      this._onItemUnselected(this.selectedItem);
      this.row -= 1;
      this._onItemSelected(this.selectedItem);
    }
    if (this.checkScrollAbove()) {
      this.viewRow -= 1;
      this.scrollY();
    }
    this.preloadAbove();
  }

  /**
   * 현재 위치에서 아래쪽 아이템을 선택합니다.
   */
  public selectBelow(): void {
    if (this.row < this.itemRow - 1) {
      this._onItemUnselected(this.selectedItem);
      this.row += 1;
      this._onItemSelected(this.selectedItem);
    }
    if (this.checkScrollBelow()) {
      this.viewRow += 1;
      this.scrollY();
    }
    this.preloadBelow();
  }

  /**
   * 현재 위치에서 왼쪽 아이템을 선택합니다.
   */
  public selectLeft(): void {
    if (this.col > 0) {
      this._onItemUnselected(this.selectedItem);
      this.col -= 1;
      this._onItemSelected(this.selectedItem);
    }
    if (this.checkScrollLeft()) {
      this.viewCol -= 1;
      this.scrollX();
    }
    this.preloadLeft();
  }

  /**
   * 현재 위치에서 오른쪽 아이템을 선택합니다.
   */
  public selectRight(): void {
    if (this.col < this.itemCol - 1) {
      this._onItemUnselected(this.selectedItem);
      this.col += 1;
      this._onItemSelected(this.selectedItem);
    }
    if (this.checkScrollRight()) {
      this.viewCol += 1;
      this.scrollX();
    }
    this.preloadRight();
  }
}

class KecapA extends Kecap {
  /**
  * 보여지는 화면을 위로 움직일 수 있는지 확인합니다.
  */
  public checkScrollAbove(): boolean {
    return this.viewRow > 0
  }

  /**
   * 보여지는 화면을 아래로 움직일 수 있는지 확인합니다.
   */
  public checkScrollBelow(): boolean {
    return this.viewRow + this.viewportRow < this.itemRow
  }

  /**
   * 보여지는 화면을 왼쪽으로 움직일 수 있는지 확인합니다.
   */
  public checkScrollLeft(): boolean {
    return this.viewCol > 0
  }

  /**
   * 보여지는 화면을 오른쪽으로 움직일 수 있는지 확인합니다.
   */
  public checkScrollRight(): boolean {
    return this.viewCol + this.viewportCol < this.itemCol
  }
}

class KecapB extends Kecap {
  /**
    * 보여지는 화면을 위로 움직일 수 있는지 확인합니다.
    */
  public checkScrollAbove(): boolean {
    return this.viewRow > 0 && this.row === this.viewRow - 1
  }

  /**
   * 보여지는 화면을 아래로 움직일 수 있는지 확인합니다.
   */
  public checkScrollBelow(): boolean {
    return this.viewRow + this.viewportRow < this.itemRow && this.row === this.viewRow + this.viewportRow
  }

  /**
   * 보여지는 화면을 왼쪽으로 움직일 수 있는지 확인합니다.
   */
  public checkScrollLeft(): boolean {
    return this.viewCol > 0 && this.col === this.viewCol - 1
  }

  /**
   * 보여지는 화면을 오른쪽으로 움직일 수 있는지 확인합니다.
   */
  public checkScrollRight(): boolean {
    return this.viewCol + this.viewportCol < this.itemCol && this.col === this.viewCol + this.viewportCol
  }
}

customElements.define('kecap-a', KecapA);
customElements.define('kecap-b', KecapB);
