<section class="Section">
  <h1 class="Section__title">Try It</h1>
  <div class="Kecap Kecap--A" bind:this={kecapAElem}>
  </div>
</section>

<style>
  .Tryout {
    background: #202020;
  }
</style>

<script lang="typescript">
  import { onMount } from 'svelte'
  import { ItemManager, ScrollBehavior } from '../../src/kecap.ts'

  let kecapAElem
  const kecapAItemCount = 100

  onMount(() => {
    for(let i = 0; i < kecapAItemCount; i++) {
      const item = document.createElement('div')
      kecapAElem.appendChild(item)
    }

    new ItemManager(kecapAElem, {
      strategy: ScrollBehavior.TYPE_A
      viewportRow: 5,
      viewportCol: 1,
      itemRow: item,
      itemCol: 1
    })
  })
</script>
