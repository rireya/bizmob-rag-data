export default class Network {
  /** Network Locale 셋팅 */
  static changeLocale(arg: {
    _sLocaleCd: string, // 언어코드 (ko, en, ...)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Network.changeLocale({
        ...arg,
        _fCallback: (res: any) => resolve(res)
      });
    });
  }

  /** bizMOB Server 로그인 통신 */
  static requestLogin(arg: {
    _sUserId: string, // 인증 받을 사용자 아이디
    _sPassword: string, // 인증 받을 사용자 패스워드
    _sTrcode: string, // 전문코드
    _oHeader?: Record<string, any>, // 전문 Header 객체
    _oBody?: Record<string, any>, // 전문 Body 객체
    _oHttpHeader?: Record<string, any>, // HTTP Header 객체
    _sQuery?: string, // Query String (web 전용)
    _bProgressEnable?: boolean, // 서버에 요청 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _nTimeout?: number, // 타임아웃 시간 (sec 단위)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Network.requestLogin({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** bizMOB Server 통신 */
  static requestTr(arg: {
    _sTrcode: string, // 전문코드
    _oHeader?: Record<string, any>, // 전문 Header 객체
    _oBody?: Record<string, any>, // 전문 Body 객체
    _oHttpHeader?: Record<string, any>, // HTTP Header 객체
    _sQuery?: string, // Query String (web 전용)
    _bProgressEnable?: boolean, // 서버에 요청 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _nTimeout?: number, // 타임아웃 시간 (sec 단위)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Network.requestTr({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** Api 서버 통신 */
  static requestHttp(arg: {
    _sUrl: string, // 서버 URL
    _sMethod: 'GET' | 'POST', // 통신 방식 (get, post)
    _oHeader?: Record<string, any>, // Http Header 객체
    _oBody?: Record<string, any>, // Http Body 객체
    _bProgressEnable?: boolean, // 서버에 요청 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _nTimeout?: number, // 타임아웃 시간 (sec 단위)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Network.requestHttp({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** Web 통신 (웹 단독) */
  static requestApi(arg: {
    _sMethod: 'GET' | 'POST', // HTTP Method
    _sUrl: string, // 호출 PATH
    _nTimeout?: number, // 타임아웃 시간 (sec 단위)
    _nRetries?: number, // API 요청 회수 (default: 1 -- 한번 요청 실패시 응답)
    _oHeader?: Record<string, any>, // HTTP Header
    _oBody?: any, // HTTP Body (Ex. new URLSearchParams(body || {}).toString(), JSON.stringify(body))
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Http.request({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }
}
