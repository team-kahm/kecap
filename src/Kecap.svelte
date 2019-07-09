<script lang="typescript">
  import { onMount } from "svelte";

  export let itemRow: number;
  export let itemCol: number;
  export let viewportRow: number;
  export let viewportCol: number;

  let viewport: Element;
  let items: Element[];

  let selectRow: number = 0;
  let selectCol: number = 0;
  let selectItem: Element;

  function select(row: number, col: number): boolean {
    if (row >= 0 && row < itemRow && col >= 0 && col < itemCol) {
      if (true) {
        // TODO: Check if item is visible
        console.log("scroll");
        viewport.scrollTo({
          top: items
            .filter(
              (_: Element, index: number) =>
                Math.floor(index / itemCol) < row && index % itemCol === col
            )
            .map(item => item.offsetHeight)
            .reduce((acc: number, cur: number) => acc + cur, 0),
          left: items
            .filter(
              (_: Element, index: number) =>
                Math.floor(index / itemCol) === row && index % itemCol < col
            )
            .map(item => item.offsetWidth)
            .reduce((acc: number, cur: number) => acc + cur, 0),
          behavior: "smooth"
        });
      } else {
        console.log("no scroll");
      }
      return true;
    }
    return false;
  }

  function selectAbove() {
    if (select(selectRow - 1, selectCol)) {
      selectItem.classList.remove("select");
      selectRow -= 1;
      selectItem = items[selectRow * itemCol + selectCol];
      selectItem.classList.add("select");
    }
  }

  function selectBelow() {
    if (select(selectRow + 1, selectCol)) {
      selectItem.classList.remove("select");
      selectRow += 1;
      selectItem = items[selectRow * itemCol + selectCol];
      selectItem.classList.add("select");
    }
  }

  function selectLeft() {
    if (select(selectRow, selectCol - 1)) {
      selectItem.classList.remove("select");
      selectCol -= 1;
      selectItem = items[selectRow * itemCol + selectCol];
      selectItem.classList.add("select");
    }
  }

  function selectRight() {
    if (select(selectRow, selectCol + 1)) {
      selectItem.classList.remove("select");
      selectCol += 1;
      selectItem = items[selectRow * itemCol + selectCol];
      selectItem.classList.add("select");
    }
  }

  onMount(() => {
    viewport = document.querySelector(".viewport")!;
    items = Array.from(document.querySelector(".grid")!.children);
    selectItem = items[0];
  });
</script>

<style>
  .viewport {
    width: 302px;
    height: 302px;
    overflow: hidden;
    white-space: nowrap;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, 100px);
    grid-gap: 1px;
  }

  .item {
    width: 100px;
    height: 100px;
    background-color: blue;
  }

  .item.select {
    background-color: red;
  }
</style>

<div class="viewport">
  <div class="grid">
    <span class="item select">0</span>
    <span class="item">1</span>
    <span class="item">2</span>
    <span class="item">3</span>
    <span class="item">4</span>
    <span class="item">5</span>
    <span class="item">6</span>
    <span class="item">7</span>
    <span class="item">8</span>
    <span class="item">9</span>
    <span class="item">10</span>
    <span class="item">11</span>
    <span class="item">12</span>
    <span class="item">13</span>
    <span class="item">14</span>
    <span class="item">15</span>
    <span class="item">16</span>
    <span class="item">17</span>
    <span class="item">18</span>
    <span class="item">19</span>
    <span class="item">20</span>
    <span class="item">21</span>
    <span class="item">22</span>
    <span class="item">23</span>
    <span class="item">24</span>
    <span class="item">25</span>
    <span class="item">26</span>
    <span class="item">27</span>
    <span class="item">28</span>
    <span class="item">29</span>
    <span class="item">30</span>
    <span class="item">31</span>
    <span class="item">32</span>
    <span class="item">33</span>
    <span class="item">34</span>
    <span class="item">35</span>
    <span class="item">36</span>
    <span class="item">37</span>
    <span class="item">38</span>
    <span class="item">39</span>
    <span class="item">40</span>
    <span class="item">41</span>
  </div>
</div>

<button on:click={selectAbove}>Select Above</button>
<button on:click={selectBelow}>Select Below</button>
<button on:click={selectLeft}>Select Left</button>
<button on:click={selectRight}>Select Right</button>
