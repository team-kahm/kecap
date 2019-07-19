import * as Kecap from './component/index'

/**
 * @description
 * 브라우저에 Kecap 클래스 등록
 */
try{
    // @ts-ignore
    window.Kecap = Kecap
}catch(e){}