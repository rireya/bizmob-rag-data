import { encode } from 'url-safe-base64';

const bizMOB: any = window.bizMOB;
const forge: any = window.forge;

/**
 * 키 공유 전문(BM4001)
 *     BM4001IMPL0001
 *         서버에서 암호화 키 생성 과정에서 오류 발생(요청 cryPbKey 값이 잘못 되었거나, 서버 오류)
 *     서버 로그 확인 필요
 *
 * 토큰 갱신 전문(BM4002)
 *     BM4002TKER1001
 *         유효하지 않은 토큰 (bizMOB Server에서 생성된 토큰이 아닐 경우, 일반적인 상황에서는 발생 안됨)
 *     BM4002TKER1002
 *         Refresh token 이 만료 되었을 경우 발생
 *     키공유전문(BM4001) 다시 호출하여 신규 암호화키, 토큰 발행
 *
 * 전문 호출
 *     EAH000
 *         서버의 세션이 만료
 *         키공유전문(BM4001) 다시 호출하여 신규 암호화키, 토큰 발행
 *     EAH001
 *         암호화 인증 토큰 만료(cryAuthToken)
 *         토큰갱신전문(BM4002) 호출하여 암호화 인증 토큰 갱신
 *     {TRCODE}CRPTEDC001
 *         서버에서 전문 복호화 시 오류 발생
 *         암호화 된 전문과 암호화 키가 일치 하지 않을 경우 발생 (일반적인 상황에서 발생 안됨)
 */
export default class BzCrypto {
  // 공개키 변환 시 제거할 문자열
  private static replaceStr1 = '-----BEGIN PUBLIC KEY-----';
  private static replaceStr2 = '-----END PUBLIC KEY-----';

  // 초기화 여부
  private static isInitialized = false;
  // 암호화 키
  private static crySymKey: string | null = null;
  // 인증 토큰
  private static cryAuthToken: string | null = null;
  // 인증 토큰 만료 시간
  private static cryAuthTokenExpTime: string | null = null;
  // 갱신 토큰
  private static cryRefreshToken: string | null = null;
  // 갱신 토큰 만료 시간
  private static cryRefreshTokenExpTime: string | null = null;

  // 암호화 키 복호화
  private static decodeUtf8 = (key: string, privateKey: any): string => {
    const decode64 = forge.util.decode64(key);
    const decrypt = privateKey.decrypt(decode64);

    return forge.util.decodeUtf8(decrypt);
  };

  // 초기화 여부 조회
  public static isInit(): boolean {
    return this.isInitialized;
  }

  // 암호화 키 조회
  public static getSymKey(): string | null {
    return this.crySymKey;
  }

  // 인증 토큰 조회
  public static getCryAuthToken(): string | null {
    return this.cryAuthToken;
  }

  // 인증 토큰 만료 시간 조회
  public static getCryAuthTokenExpTime(): string | null {
    return this.cryAuthTokenExpTime;
  }

  // 갱신 토큰 조회
  public static getCryRefreshToken(): string | null {
    return this.cryRefreshToken;
  }

  // 갱신 토큰 만료 시간 조회
  public static getCryRefreshTokenExpTime(): string | null {
    return this.cryRefreshTokenExpTime;
  }

  /** BzCrypto 초기화 */
  public static init(arg: {
    crySymKey: string | null; // 암호화 키
    cryAuthToken: string | null; // 인증 토큰
    cryAuthTokenExpTime: string | null; // 인증 토큰 만료 시간 (yyyy-MM-dd HH:mm:ss)
    cryRefreshToken: string | null; // 갱신 토큰
    cryRefreshTokenExpTime: string | null; // 갱신 토큰 만료 시간 (yyyy-MM-dd HH:mm:ss)
  }): void {
    this.isInitialized = true;
    this.crySymKey = arg.crySymKey;
    this.cryAuthToken = arg.cryAuthToken;
    this.cryAuthTokenExpTime = arg.cryAuthTokenExpTime;
    this.cryRefreshToken = arg.cryRefreshToken;
    this.cryRefreshTokenExpTime = arg.cryRefreshTokenExpTime;

    // 설정 업데이트
    bizMOB.setConfig('WEB', 'Network', {
      _sCrySymKey: arg.crySymKey || '',
      _sCryAuthToken: arg.cryAuthToken || '',
    });
  }

  /** Auth Token 발급 */
  public static shareAuthKey(arg?: {
    _bProgressEnable?: boolean; // Native App Progress 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      // 512비트 RSA 키 쌍 생성
      const keys = forge.pki.rsa.generateKeyPair(512);
      const privateKey = keys.privateKey;
      const publicKey = keys.publicKey;
      // 공개키를 PEM 형식으로 변환하고, 불필요한 문자열 제거
      const publicPem = forge.pki
        .publicKeyToPem(publicKey)
        .replace(this.replaceStr1, '')
        .replace(this.replaceStr2, '')
        .replace(/(\r\n|\n|\r)/gm, '');

      // 네트워크 요청
      bizMOB.Network.requestTr({
        _sTrcode: 'BM4001',
        _oBody: {
          cryPbKey: encode(publicPem) // 인코딩된 공개키
        },
        _bProgressEnable: arg?._bProgressEnable ?? false,
        _fCallback: (res: any) => {
          if (res.header.result) {
            // 응답에서 토큰과 만료 시간을 가져옴
            this.crySymKey = this.decodeUtf8(res.body.crySymKey, privateKey); // 복호화된 암호화키
            this.cryAuthToken = res.body.cryAuthToken; // 인증Token
            this.cryAuthTokenExpTime = res.body.cryAuthTokenExpTime; // 인증Token 만료시간(yyyy-MM-dd HH:mm:ss)
            this.cryRefreshToken = res.body.cryRefreshToken; // 갱신Token
            this.cryRefreshTokenExpTime = res.body.cryRefreshTokenExpTime; // 갱신Token 만료시간(yyyy-MM-dd HH:mm:ss)

            // 설정 업데이트
            bizMOB.setConfig('WEB', 'Network', {
              _sCrySymKey: this.crySymKey,
              _sCryAuthToken: this.cryAuthToken,
            });

            // 성공 시 resolve
            resolve({
              crySymKey: this.crySymKey,
              cryAuthToken: this.cryAuthToken,
              cryAuthTokenExpTime: this.cryAuthTokenExpTime,
              cryRefreshToken: this.cryRefreshToken,
              cryRefreshTokenExpTime: this.cryRefreshTokenExpTime,
            });
          }
          else {
            // 에러 발생 시 토큰과 만료 시간을 초기화
            this.crySymKey = null; // 암호화키
            this.cryAuthToken = null; // 인증Token
            this.cryAuthTokenExpTime = null; // 인증Token 만료시간(yyyy-MM-dd HH:mm:ss)
            this.cryRefreshToken = null; // 갱신Token
            this.cryRefreshTokenExpTime = null; // 갱신Token 만료시간(yyyy-MM-dd HH:mm:ss)

            // 설정 업데이트
            bizMOB.setConfig('WEB', 'Network', {
              _sCryAuthToken: '',
              _sCrySymKey: '',
            });

            // 에러 코드로 reject
            reject(res.header.error_code);
          }
        }
      });
    });
  }

  /** Auth Token 갱신 */
  public static renewAuthToken(arg?: {
    _bProgressEnable?: boolean; // Native App Progress 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      // 네트워크 요청
      bizMOB.Network.requestTr({
        _sTrcode: 'BM4002', // 트랜잭션 코드
        _oBody: {
          cryAuthToken: this.cryAuthToken, // 현재 인증 토큰
          cryRefreshToken: this.cryRefreshToken // 현재 리프레시 토큰
        },
        _bProgressEnable: arg?._bProgressEnable ?? false, // 프로그레스 표시 여부
        _fCallback: (res: any) => { // 콜백 함수
          if (res.header.result) { // 응답이 성공적인 경우
            // 새로운 토큰과 만료 시간을 저장
            this.cryAuthToken = res.body.cryAuthToken; // 인증Token
            this.cryAuthTokenExpTime = res.body.cryAuthTokenExpTime; // 인증Token 만료시간(yyyy-MM-dd HH:mm:ss)
            this.cryRefreshToken = res.body.cryRefreshToken; // 갱신Token
            this.cryRefreshTokenExpTime = res.body.cryRefreshTokenExpTime; // 갱신Token 만료시간(yyyy-MM-dd HH:mm:ss)

            // 설정 업데이트
            bizMOB.setConfig('WEB', 'Network', {
              _sCryAuthToken: this.cryAuthToken,
            });

            // 성공 시 resolve
            resolve({
              crySymKey: this.crySymKey,
              cryAuthToken: this.cryAuthToken,
              cryAuthTokenExpTime: this.cryAuthTokenExpTime,
              cryRefreshToken: this.cryRefreshToken,
              cryRefreshTokenExpTime: this.cryRefreshTokenExpTime,
            });
          }
          else { // 응답이 실패한 경우
            // 토큰과 만료 시간을 초기화
            this.cryAuthToken = null; // 인증Token
            this.cryAuthTokenExpTime = null; // 인증Token 만료시간(yyyy-MM-dd HH:mm:ss)
            this.cryRefreshToken = null; // 갱신Token
            this.cryRefreshTokenExpTime = null; // 갱신Token 만료시간(yyyy-MM-dd HH:mm:ss)

            // 설정 업데이트
            bizMOB.setConfig('WEB', 'Network', {
              _sCryAuthToken: '',
            });

            // 에러 코드로 reject
            reject(res.header.error_code);
          }
        }
      });
    });
  }

  /** Auth Token 발급 필요 여부 */
  public static isTokenRequired(): boolean {
    return !this.cryAuthToken;
  }

  /** Auth Token 만료 여부 */
  public static isTokenExpired(): boolean {
    const nowTime = new Date(); // 현재 시간 (로컬 타임존 기준)
    const authTokenTime = new Date(this.cryAuthTokenExpTime + 'Z'); // 'Z'를 추가하여 UTC로 파싱하도록 함
    const refreshTokenTime = new Date(this.cryRefreshTokenExpTime + 'Z'); // 'Z'를 추가하여 UTC로 파싱하도록 함

    // 토큰이 있는 경우만 비교
    if (this.cryAuthToken) {
      return (nowTime > authTokenTime) || (nowTime > refreshTokenTime); // 현재 시간이 주어진 시간보다 이후인지 비교
    }
    else {
      return true; // 토큰이 없는 경우 만료된 것으로 간주
    }
  }
}