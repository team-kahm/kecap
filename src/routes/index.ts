import Home from   './home.svelte'

import Design from './design/index.svelte'
import Code from   './code/index.svelte'
import Deploy from './deploy/index.svelte'

export default {
    '/': Home,

    '/design': Design,
    '/code': Code,
    '/deploy': Deploy,

    '*': Home,
}
