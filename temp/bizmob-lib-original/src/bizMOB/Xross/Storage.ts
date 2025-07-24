const bizMOB: any = window.bizMOB;

// sessionStorage와 동일
export default class Storage {
    /** Storage 조회 */
    static get(arg?: {
        _sKey: string, // Storage 에서 가져올 키 값
    }): any {
        return bizMOB.Storage.get({
            ...arg,
        });
    }

    /** Storage 제거 */
    static remove(arg?: {
        _sKey: string, // Storage 에서 삭제할 키 값
    }): void {
        return bizMOB.Storage.remove({
            ...arg,
        });
    }

    /** Storage 저장 (단일) */
    static set(arg?: {
        _sKey: string, // Storage 에 저장할 키 값
        _vValue: any, // Storage 에 저장할 값
    }): void {
        return bizMOB.Storage.set({
            ...arg,
        });
    }

    /** Storage 저장 (복수) */
    static setList(arg?: {
        _aList: {
            _sKey: string, // Storage 에 저장할 키 값
            _vValue: any, // Storage 에 저장할 값
        }[]
    }): void {
        return bizMOB.Storage.setList({
            ...arg,
        });
    }
}