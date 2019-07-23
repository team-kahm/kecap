<div id="App">
  <Navbar></Navbar>

  <main>
    <SectionMain id="main"></SectionMain>
    <SectionTryout id="tryout"></SectionTryout>
    <SectionInstall id="install"></SectionInstall>
    <SectionUsage id="usage"></SectionUsage>
  </main>
</div>

<style>
  #App {
    display: flex;
  }

  #App main {
    flex: 1;
    height: 100vh;
    overflow: auto;
  }
</style>

<script lang="typescript">
  import Navbar from "./components/Navbar.svelte";
  import SectionInstall from "./components/SectionInstall.svelte";
  import SectionMain from "./components/SectionMain.svelte";
  import SectionTryout from "./components/SectionTryout.svelte";
  import SectionUsage from "./components/SectionUsage.svelte";
</script>
