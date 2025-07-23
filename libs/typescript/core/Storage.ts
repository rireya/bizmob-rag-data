// sessionStorage와 동일
export default class Storage {
  /** Storage 조회 */
  static get(arg: {
    _sKey: string, // Storage 에서 가져올 키 값
  }): any {
    return window.bizMOB.Storage.get({
      ...arg,
    });
  }

  /** Storage 제거 */
  static remove(arg: {
    _sKey: string, // Storage 에서 삭제할 키 값
  }): void {
    window.bizMOB.Storage.remove({
      ...arg,
    });
  }

  /** Storage 저장 (단일) */
  static set(arg: {
    _sKey: string, // Storage 에 저장할 키 값
    _vValue: any, // Storage 에 저장할 값
  }): void {
    window.bizMOB.Storage.set({
      ...arg,
    });
  }

  /** Storage 저장 (복수) */
  static setList(arg: {
    _aList: {
      _sKey: string, // Storage 에 저장할 키 값
      _vValue: any, // Storage 에 저장할 값
    }[]
  }): void {
    window.bizMOB.Storage.setList({
      ...arg,
    });
  }
}
