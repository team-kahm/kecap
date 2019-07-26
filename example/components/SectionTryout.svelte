<section class="Section">
  <h1 class="Section__title">Try It</h1>
  <h2>Type A</h2>
  <div class="Kecap Kecap--A" bind:this={kecapAElem}>
    <div class="Kecap__grid" bind:this={kecapAChildElem}></div>
  </div>
  <h2>Type B</h2>
  <div class="Kecap Kecap--B" bind:this={kecapBElem}>
    <div class="Kecap__grid" bind:this={kecapBChildElem}></div>
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

  .Kecap--B {
    width: 550px;
    height: 550px;
    overflow: hidden;
  }

  .Kecap__grid {
    display: grid;
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
  import { Kecap, KecapBehavior } from '../../src/kecap'

  let kecapAElem: HTMLElement, kecapAChildElem: HTMLElement
  let kecapBElem: HTMLElement, kecapBChildElem: HTMLElement
  const kecapAItemCount = 100
  const kecapBItemCount = 100

  onMount(() => {
    kecapAChildElem.innerHTML = '';
    for(let i = 0; i < kecapAItemCount; i++) {
      const item = document.createElement('div')
      item.innerText = `${i}`

      kecapAChildElem.appendChild(item)
    }
     for(let i = 0; i < kecapAItemCount; i++) {
      const item = document.createElement('div')
      item.innerText = `${i}`

      kecapBChildElem.appendChild(item)
    }

    const kecapA = new Kecap(kecapAElem, {
      strategy: KecapBehavior.TYPE_A,
      viewportCol: 5,
      viewportRow: 1,
      itemCol: kecapAItemCount,
      itemRow: 1
    })
    kecapA.init()

    const kecapB = new Kecap(kecapBElem, {
      strategy: KecapBehavior.TYPE_B,
      viewportCol: 5,
      viewportRow: 5,
      itemCol: 10,
      itemRow: 10
    })
    kecapB.init()
  })
</script>
