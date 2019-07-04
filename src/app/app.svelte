<!-- START Container -->
<div id="container">
    <div>
        <a href="/#/">Home</a><br>
        <a href="/#/design">Design</a><br>
        <a href="/#/code">Code</a><br>
        <a href="/#/deploy">Deploy</a><br>
    </div>

    <!-- Route -->
    <Router {routes}/>
</div>
<!-- ENDED Container -->

<script lang="typescript">
import Router from 'svelte-spa-router/Router.svelte'
import routes from '../routes'
</script>
