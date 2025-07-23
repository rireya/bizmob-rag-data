export default class Localization {
  /** Locale 조회 */
  static getLocale(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Localization.getLocale({
        ...arg,
        _fCallback: (res: any) => resolve(res)
      });
    });
  }

  /** Locale 셋팅 */
  static setLocale(arg: {
    _sLocaleCd: string, // 언어코드 (ko, en, ...)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Localization.setLocale({
        ...arg,
        _fCallback: (res: any) => resolve(res)
      });
    });
  }
}
