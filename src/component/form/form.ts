import FormComponent from './index.svelte'

/**
 * @description
 * Vanilla JS 환경에서도 컴포넌트를 쓸 수 있도록
 * DIV 엘레먼트를 컴포넌트에 맞게끔 재구성합니다.
 * 
 * @param selector Grid 셀렉터를 지정합니다.
 */
export const Form = (selector: string) => {
    /**
     * @description
     * - `div collect`
     * - `svelte parse & load`
     * - `svelte to html`
     * - `origin div override`
     */

    // document.querySelector('.grid')
    let gridElement = document.querySelector(selector) as HTMLElement
    if(!gridElement) return

    // Grid 하위 엘레먼트들을 수집합니다.
    let grids = gridElement.children

    let formComponent = new FormComponent({

        // Svelte 컴포넌트가
        // 렌더링 될 엘레먼트를 지정합니다.
        target: gridElement,

        // Grid 하위 엘레먼트를 수집합니다.
        props: { grids }
    })
}