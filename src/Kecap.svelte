<script lang="typescript">
  // export const itemRow: number;
  // export const itemCol: number;
  // export const viewportRow: number;
  // export const viewportCol: number;
</script>

<style>
  .viewport {
    width: 201px;
    height: 201px;
    overflow: hidden;
    white-space: nowrap;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 100px);
    grid-gap: 1px;
  }

  .item {
    width: 100px;
    height: 100px;
    background-color: blue;
  }
</style>

<div class="viewport">
  <div class="grid">
    <span class="item">a</span>
    <span class="item">b</span>
    <span class="item">c</span>
    <span class="item">d</span>
    <span class="item">e</span>
    <span class="item">f</span>
    <span class="item">a</span>
    <span class="item">b</span>
    <span class="item">c</span>
    <span class="item">d</span>
    <span class="item">e</span>
    <span class="item">f</span>
  </div>
</div>
