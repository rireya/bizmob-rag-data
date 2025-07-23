// localStorage와 동일
export default class Properties {
  /** Properties 조회 */
  static get(arg: {
    _sKey: string, // Property에서 가져올 키 값
  }): any {
    return window.bizMOB.Properties.get({
      ...arg,
    });
  }

  /** Properties 제거 */
  static remove(arg: {
    _sKey: string, // Property에서 삭제할 키 값
  }): void {
    window.bizMOB.Properties.remove({
      ...arg,
    });
  }

  /** Properties 저장 (단일) */
  static set(arg: {
    _sKey: string, // Property에 저장할 키 값
    _vValue: any, // Property에 저장할 값
  }): void {
    window.bizMOB.Properties.set({
      ...arg,
    });
  }

  /** Properties 저장 (복수) */
  static setList(arg: {
    _aList: {
      _sKey: string, // Property에 저장할 키 값
      _vValue: any, // Property에 저장할 값
    }[]
  }): void {
    window.bizMOB.Properties.setList({
      ...arg,
    });
  }
}
