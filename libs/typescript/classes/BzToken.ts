const bizMOB: any = window.bizMOB;

/**
 * 토큰 갱신 전문(BM4002)
 *     BM4002TKER1001
 *         유효하지 않은 토큰 (bizMOB Server에서 생성된 토큰이 아닐 경우, 일반적인 상황에서는 발생 안됨)
 *     BM4002TKER1002
 *         Refresh token 이 만료 되었을 경우 발생
 *
 * 전문 호출
 *     ERR000
 *         Token 유효 시간 만료. AccessToken 갱신 필요
 */
export default class BzToken {
  // 초기화 여부
  private static isInitialized = false;
  // 로그인 인증 토큰
  private static accessToken: string | null = null;
  // 로그인 인증 토큰 만료 시간
  private static accessTokenExpTime: string | null = null;
  // 갱신 토큰
  private static refreshToken: string | null = null;
  // 갱신 토큰 만료 시간
  private static refreshTokenExpTime: string | null = null;

  // 초기화 여부 조회
  public static isInit(): boolean {
    return this.isInitialized;
  }

  // 인증 토큰 조회
  public static getAccessToken(): string | null {
    return this.accessToken;
  }

  // 인증 토큰 만료 시간 조회
  public static getAccessTokenExpTime(): string | null {
    return this.accessTokenExpTime;
  }

  // 갱신 토큰 조회
  public static getRefreshToken(): string | null {
    return this.refreshToken;
  }

  // 갱신 토큰 만료 시간 조회
  public static getRefreshTokenExpTime(): string | null {
    return this.refreshTokenExpTime;
  }

  /** JWT Token 저장 */
  public static init(arg: {
    accessToken: string; // 로그인 인증 Token
    accessTokenExpTime: string; // 로그인 인증 Token 만료 시간 (yyyy-MM-dd HH:mm:ss)
    refreshToken: string; // 로그인 갱신 Token
    refreshTokenExpTime: string; // 로그인 갱신 Token 만료 시간 (yyyy-MM-dd HH:mm:ss)
  }): void {
    this.isInitialized = true;
    this.accessToken = arg.accessToken;
    this.accessTokenExpTime = arg.accessTokenExpTime;
    this.refreshToken = arg.refreshToken;
    this.refreshTokenExpTime = arg.refreshTokenExpTime;

    // 설정 업데이트
    bizMOB.setConfig('APP', 'Network', {
      _sJwtToken: this.accessToken,
    });

    bizMOB.setConfig('WEB', 'Network', {
      _sJwtToken: this.accessToken,
    });
  }

  /** JWT Token 갱신 */
  public static renewToken(arg?: {
    _bProgressEnable?: boolean; // Native App Progress 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      bizMOB.Network.requestTr({
        _sTrcode: 'BM4002', // 트랜잭션 코드
        _oBody: {
          accessToken: this.accessToken, // 현재 인증 토큰
          refreshToken: this.refreshToken // 현재 리프레시 토큰
        },
        _bProgressEnable: arg?._bProgressEnable ?? false, // 프로그레스 표시 여부
        _fCallback: (res: any) => { // 콜백 함수
          if (res.header.result) { // 응답이 성공적인 경우
            this.accessToken = res.body.accessToken; // 로그인 인증 Token
            this.accessTokenExpTime = res.body.accessTokenExpTime; // 로그인 인증 Token 만료 시간
            this.refreshToken = res.body.refreshToken; // 로그인 갱신 Token
            this.refreshTokenExpTime = res.body.refreshTokenExpTime; // 로그인 갱신 Token 만료 시간

            // 설정 업데이트
            bizMOB.setConfig('APP', 'Network', {
              _sJwtToken: this.accessToken,
            });

            bizMOB.setConfig('WEB', 'Network', {
              _sJwtToken: this.accessToken,
            });

            resolve({
              accessToken: this.accessToken,
              accessTokenExpTime: this.accessTokenExpTime,
              refreshToken: this.refreshToken,
              refreshTokenExpTime: this.refreshTokenExpTime,
            });
          }
          else { // 응답이 실패한 경우
            this.accessToken = null; // 로그인 인증 Token
            this.accessTokenExpTime = null; // 로그인 인증 Token 만료 시간
            this.refreshToken = null; // 로그인 갱신 Token
            this.refreshTokenExpTime = null; // 로그인 갱신 Token 만료 시간

            // 설정 업데이트
            bizMOB.setConfig('APP', 'Network', {
              _sJwtToken: '',
            });

            bizMOB.setConfig('WEB', 'Network', {
              _sJwtToken: '',
            });

            // 에러 코드로 reject
            reject(res.header.error_code);
          }
        }
      });
    });
  }

  /** Jwt Token 만료 여부 */
  public static isTokenExpired(): boolean {
    const nowTime = new Date();
    const accessTime = new Date(this.accessTokenExpTime + 'Z');
    const refreshTime = new Date(this.refreshTokenExpTime + 'Z');

    return (nowTime > accessTime) || (nowTime > refreshTime);
  }
}