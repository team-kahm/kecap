<section class="Section">
  <h1 class="Section__title">Try It</h1>
  <div class="Kecap Kecap--A" bind:this={kecapAElem}>
    <div class="Kecap__grid" bind:this={kecapAChildElem}></div>
  </div>
</section>

<style>
  .Section {
    background: #202020;
  }

  .Kecap--A {
    width: 550px;
    height: 100px;
    overflow: hidden;
  }

  .Kecap__grid {
    display: grid;
    grid-template-columns: repeat(100, 100px);
    grid-gap: 10px;
  }

  :global(.Kecap__grid div) {
    width: 100px;
    height: 100px;
    color: #f1f2f3;
    line-height: 100px;
    text-align: center;
    background-color: #039be5;
  }

  :global(.Kecap__grid .select) {
    background-color: red;
  }
</style>

<script lang="typescript">
  import { onMount } from 'svelte'
  import { ItemManager, ScrollBehavior } from '../../src/kecap'

  let kecapAElem: HTMLElement, kecapAChildElem: HTMLElement
  const kecapAItemCount = 100

  onMount(() => {
    kecapAChildElem.innerHTML = '';
    for(let i = 0; i < kecapAItemCount; i++) {
      const item = document.createElement('div')
      item.innerText = `${i}`

      kecapAChildElem.appendChild(item)
    }

    const manager = new ItemManager(kecapAElem, {
      strategy: ScrollBehavior.TYPE_A,
      viewportCol: 5,
      viewportRow: 1,
      itemCol: kecapAItemCount,
      itemRow: 1
    })

    window.addEventListener('keydown', key => {
      switch(key.code) {
        case 'ArrowLeft':
          manager.selectLeft()
          break
        case 'ArrowRight':
          manager.selectRight()
          break
      }
    })
  })
</script>
