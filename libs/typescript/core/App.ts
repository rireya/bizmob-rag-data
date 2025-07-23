export default class App {
  /**
   * Native 플러그인 호출 API
   * @param api Native Call API ID
   * @param arg call 파라미터
   * @returns
   */
  static callPlugIn(api: string, arg?: {
    [key: string]: any;
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.callPlugIn(api, {
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 앱 종료 */
  static exit(arg: {
    _sType: 'exit' | 'kill' | 'logout', // 어플리케이션 종료 유형입니다. kill or exit : 어플리케이션 종료, logout : 어플리케이션 재시작
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.exit({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 세션타임아웃 조회 */
  static getTimeout(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.getTimeout({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 세션타임아웃 설정 (분 단위 설정) */
  static setTimeout(arg?: {
    _nSeconds: number, // 어플리케이션의 자동 종료 시간 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.setTimeout({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** Native 스플래시 숨김 (스플래시 수동 조작 앱인 경우) */
  static hideSplash() {
    return new Promise(resolve => {
      window.bizMOB.App.hideSplash({
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }
}
