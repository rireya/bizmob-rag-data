declare namespace bizMOB {
  // Config
  interface Config {
    set(target: string, className: string, arg: any): void;
    get(target: string, className: string): any;
  }

  // Logger
  interface Logger {
    info(message: string): void;
    log(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
    error(message: string): void;
  }

  // Storage
  interface Storage {
    get(arg: { _sKey: string }): any;
    remove(arg: { _sKey: string }): void;
    set(arg: { _sKey: string; _vValue: any }): void;
    setList(arg: { _aList: { _sKey: string; _vValue: any }[] }): void;
  }

  // Properties
  interface Properties {
    // 직접 값을 반환하는 동기식 함수들
    get(arg: { _sKey: string }): any;
    remove(arg: { _sKey: string }): void;
    set(arg: { _sKey: string; _vValue: any }): void;
    setList(arg: { _aList: { _sKey: string; _vValue: any }[] }): void;
  }

  // Network
  interface Network {
    // JS 형식 (callback 필수)
    changeLocale(arg: { _sLocaleCd: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    // TS 형식 (callback 없음, Promise 반환)
    changeLocale(arg: { _sLocaleCd: string; _bMock?: boolean }): Promise<Record<string, any>>;

    requestLogin(arg: {
      _sUserId: string;
      _sPassword: string;
      _sTrcode: string;
      _oHeader?: Record<string, any>;
      _oBody?: Record<string, any>;
      _oHttpHeader?: Record<string, any>;
      _sQuery?: string;
      _bProgressEnable?: boolean;
      _nTimeout?: number;
      _bMock?: boolean;
      _fCallback: (result: any) => void;
    }): void;
    requestLogin(arg: {
      _sUserId: string;
      _sPassword: string;
      _sTrcode: string;
      _oHeader?: Record<string, any>;
      _oBody?: Record<string, any>;
      _oHttpHeader?: Record<string, any>;
      _sQuery?: string;
      _bProgressEnable?: boolean;
      _nTimeout?: number;
      _bMock?: boolean;
    }): Promise<Record<string, any>>;

    requestTr(arg: {
      _sTrcode: string;
      _oHeader?: Record<string, any>;
      _oBody?: Record<string, any>;
      _oHttpHeader?: Record<string, any>;
      _sQuery?: string;
      _bProgressEnable?: boolean;
      _nTimeout?: number;
      _bMock?: boolean;
      _fCallback: (result: any) => void;
    }): void;
    requestTr(arg: {
      _sTrcode: string;
      _oHeader?: Record<string, any>;
      _oBody?: Record<string, any>;
      _oHttpHeader?: Record<string, any>;
      _sQuery?: string;
      _bProgressEnable?: boolean;
      _nTimeout?: number;
      _bMock?: boolean;
    }): Promise<Record<string, any>>;

    requestHttp(arg: {
      _sUrl: string;
      _sMethod: 'GET' | 'POST';
      _oHeader?: Record<string, any>;
      _oBody?: Record<string, any>;
      _bProgressEnable?: boolean;
      _nTimeout?: number;
      _bMock?: boolean;
      _fCallback: (result: any) => void;
    }): void;
    requestHttp(arg: {
      _sUrl: string;
      _sMethod: 'GET' | 'POST';
      _oHeader?: Record<string, any>;
      _oBody?: Record<string, any>;
      _bProgressEnable?: boolean;
      _nTimeout?: number;
      _bMock?: boolean;
    }): Promise<Record<string, any>>;

    requestApi(arg: {
      _sMethod: 'GET' | 'POST';
      _sUrl: string;
      _nTimeout?: number;
      _nRetries?: number;
      _oHeader?: Record<string, any>;
      _oBody?: any;
      _fCallback: (result: any) => void;
    }): void;
    requestApi(arg: {
      _sMethod: 'GET' | 'POST';
      _sUrl: string;
      _nTimeout?: number;
      _nRetries?: number;
      _oHeader?: Record<string, any>;
      _oBody?: any;
    }): Promise<Record<string, any>>;
  }

  // App
  interface App {
    // JS 형식 (callback 필수)
    callPlugIn(api: string, options: { [key: string]: any; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    exit(options: { _sType?: 'exit' | 'kill' | 'logout'; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    getTimeout(options: { _bMock?: boolean; _fCallback: (result: any) => void }): void;
    setTimeout(options: { _nSeconds?: number; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    hideSplash(options: { _fCallback: (result: any) => void }): void;
    // TS 형식 (callback 없음, Promise 반환)
    callPlugIn(api: string, options?: { [key: string]: any; _bMock?: boolean }): Promise<Record<string, any>>;
    exit(options?: { _sType?: 'exit' | 'kill' | 'logout'; _bMock?: boolean }): Promise<Record<string, any>>;
    getTimeout(options?: { _bMock?: boolean }): Promise<Record<string, any>>;
    setTimeout(options?: { _nSeconds?: number; _bMock?: boolean }): Promise<Record<string, any>>;
    hideSplash(): Promise<Record<string, any>>;
  }

  // Device
  interface Device {
    getInfo(): any;
    getInfo(arg: { _sKey: string }): any;
    isApp(): boolean;
    isWeb(): boolean;
    isMobile(): boolean;
    isPC(): boolean;
    isAndroid(): boolean;
    isIOS(): boolean;
    isTablet(): boolean;
    isPhone(): boolean;
  }

  // File
  interface File {
    // JS 형식 (callback 필수)
    copy(arg: { _sSourcePath: string; _sTargetPath: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    directory(arg: { _sDirectory: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    download(arg: {
      _aFileList: { _sURI: string; _bOverwrite: boolean; _sFileName: string; _sDirectory: string }[];
      _sMode: 'foreground' | 'background';
      _sProgressBar: 'off' | 'each' | 'full';
      _bMock?: boolean;
      _fCallback: (result: any) => void;
    }): void;
    exist(arg: { _sSourcePath: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    getInfo(arg: { _aFileList: { _sSourcePath: string }[]; _bMock?: boolean; _fCallback: (result: any[]) => void }): void;
    move(arg: { _sSourcePath: string; _sTargetPath: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    open(arg: { _sSourcePath: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    remove(arg: { _aSourcePath: string[]; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    resizeImage(arg: {
      _aFileList: { _sSourcePath: string }[];
      _bIsCopy: boolean;
      _sTargetDirectory: string;
      _nCompressRate: number;
      _nWidth: number;
      _nHeight: number;
      _bMock?: boolean;
      _fCallback: (result: any) => void;
    }): void;
    rotateImage(arg: {
      _sSourcePath: string;
      _sTargetPath: string;
      _nOrientation: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
      _bMock?: boolean;
      _fCallback: (result: any) => void;
    }): void;
    unzip(arg: { _sSourcePath: string; _sDirectory: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    upload(arg: { _aFileList: { _sSourcePath: string; _sFileName: string }[]; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    zip(arg: { _sSourcePath: string; _sTargetPath: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    // TS 형식 (callback 없음, Promise 반환)
    copy(arg?: { _sSourcePath: string; _sTargetPath: string; _bMock?: boolean }): Promise<Record<string, any>>;
    directory(arg?: { _sDirectory: string; _bMock?: boolean }): Promise<Record<string, any>>;
    download(arg?: {
      _aFileList: { _sURI: string; _bOverwrite: boolean; _sFileName: string; _sDirectory: string }[];
      _sMode: 'foreground' | 'background';
      _sProgressBar: 'off' | 'each' | 'full';
      _bMock?: boolean;
    }): Promise<Record<string, any>>;
    exist(arg?: { _sSourcePath: string; _bMock?: boolean }): Promise<Record<string, any>>;
    getInfo(arg?: { _aFileList: { _sSourcePath: string }[]; _bMock?: boolean }): Promise<Record<string, any>[]>;
    move(arg?: { _sSourcePath: string; _sTargetPath: string; _bMock?: boolean }): Promise<Record<string, any>>;
    open(arg?: { _sSourcePath: string; _bMock?: boolean }): Promise<Record<string, any>>;
    remove(arg?: { _aSourcePath: string[]; _bMock?: boolean }): Promise<Record<string, any>>;
    resizeImage(arg?: {
      _aFileList: { _sSourcePath: string }[];
      _bIsCopy: boolean;
      _sTargetDirectory: string;
      _nCompressRate: number;
      _nWidth: number;
      _nHeight: number;
      _bMock?: boolean;
    }): Promise<Record<string, any>>;
    rotateImage(arg?: {
      _sSourcePath: string;
      _sTargetPath: string;
      _nOrientation: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
      _bMock?: boolean;
    }): Promise<Record<string, any>>;
    unzip(arg?: { _sSourcePath: string; _sDirectory: string; _bMock?: boolean }): Promise<Record<string, any>>;
    upload(arg?: { _aFileList: { _sSourcePath: string; _sFileName: string }[]; _bMock?: boolean }): Promise<Record<string, any>>;
    zip(arg?: { _sSourcePath: string; _sTargetPath: string; _bMock?: boolean }): Promise<Record<string, any>>;
  }

  // Push
  interface Push {
    // JS 형식 (callback 필수)
    getAlarm(arg: { _sUserId: string; _bProgressEnable?: boolean; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    getMessageList(arg: { _sUserId: string; _nPageIndex: number; _nItemCount: number; _sAppName: string; _bProgressEnable?: boolean; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    getPushKey(arg: { _bProgressEnable?: boolean; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    getUnreadCount(arg: { _sUserId: string; _sAppName: string; _bProgressEnable?: boolean; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    readMessage(arg: { _sTrxDay: string; _sTrxId: string; _sUserId: string; _bProgressEnable?: boolean; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    readReceiptMessage(arg: { _sUserId: string; _sMessageId: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    registerToServer(arg: { _sServerType: 'bizpush' | 'push'; _sUserId: string; _sAppName: string; _bProgressEnable?: boolean; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    reset(arg: { _fCallback: (result: any) => void }): void;
    sendMessage(arg: { _sAppName: string; _aUsers: string[]; _sFromUser: string; _sSubject: string; _sContent: string; _sTrxType: 'INSTANT' | 'SCHEDULE'; _sScheduleDate?: string; _aGroups?: string[]; _bToAll?: boolean; _sCategory?: string; _oPayLoad?: Record<string, any>; _bProgressEnable?: boolean; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    setAlarm(arg: { _sUserId: string; _bEnabled: boolean; _bProgressEnable?: boolean; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    setBadgeCount(arg: { _nBadgeCount: number; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    // TS 형식 (callback 없음, Promise 반환)
    getAlarm(arg?: { _sUserId: string; _bProgressEnable?: boolean; _bMock?: boolean }): Promise<Record<string, any>>;
    getMessageList(arg?: { _sUserId: string; _nPageIndex: number; _nItemCount: number; _sAppName: string; _bProgressEnable?: boolean; _bMock?: boolean }): Promise<Record<string, any>>;
    getPushKey(arg?: { _bProgressEnable?: boolean; _bMock?: boolean }): Promise<Record<string, any>>;
    getUnreadCount(arg?: { _sUserId: string; _sAppName: string; _bProgressEnable?: boolean; _bMock?: boolean }): Promise<Record<string, any>>;
    readMessage(arg?: { _sTrxDay: string; _sTrxId: string; _sUserId: string; _bProgressEnable?: boolean; _bMock?: boolean }): Promise<Record<string, any>>;
    readReceiptMessage(arg?: { _sUserId: string; _sMessageId: string; _bMock?: boolean }): Promise<Record<string, any>>;
    registerToServer(arg?: { _sServerType: 'bizpush' | 'push'; _sUserId: string; _sAppName: string; _bProgressEnable?: boolean; _bMock?: boolean }): Promise<Record<string, any>>;
    reset(): Promise<Record<string, any>>;
    sendMessage(arg?: { _sAppName: string; _aUsers: string[]; _sFromUser: string; _sSubject: string; _sContent: string; _sTrxType: 'INSTANT' | 'SCHEDULE'; _sScheduleDate?: string; _aGroups?: string[]; _bToAll?: boolean; _sCategory?: string; _oPayLoad?: Record<string, any>; _bProgressEnable?: boolean; _bMock?: boolean }): Promise<Record<string, any>>;
    setAlarm(arg?: { _sUserId: string; _bEnabled: boolean; _bProgressEnable?: boolean; _bMock?: boolean }): Promise<Record<string, any>>;
    setBadgeCount(arg?: { _nBadgeCount: number; _bMock?: boolean }): Promise<Record<string, any>>;
  }

  // System
  interface System {
    // JS 형식 (callback 필수)
    callBrowser(arg: { _sURL: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    callCamera(arg: { _sFileName?: string; _sDirectory?: string; _bAutoVerticalHorizontal: boolean; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    callGallery(arg: { _sType: 'all' | 'image' | 'video'; _nMaxCount?: number; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    callMap(arg: { _sLocation: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    callSMS(arg: { _aNumber: string[]; _sMessage?: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    callTEL(arg: { _sNumber: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    getGPS(arg: { _bMock?: boolean; _fCallback: (result: any) => void }): void;
    // TS 형식 (callback 없음, Promise 반환)
    callBrowser(arg?: { _sURL: string; _bMock?: boolean }): Promise<void>;
    callCamera(arg?: { _sFileName?: string; _sDirectory?: string; _bAutoVerticalHorizontal: boolean; _bMock?: boolean }): Promise<Record<string, any>>;
    callGallery(arg?: { _sType: 'all' | 'image' | 'video'; _nMaxCount?: number; _bMock?: boolean }): Promise<Record<string, any>>;
    callMap(arg?: { _sLocation: string; _bMock?: boolean }): Promise<Record<string, any>>;
    callSMS(arg?: { _aNumber: string[]; _sMessage?: string; _bMock?: boolean }): Promise<Record<string, any>>;
    callTEL(arg?: { _sNumber: string; _bMock?: boolean }): Promise<Record<string, any>>;
    getGPS(arg?: { _bMock?: boolean }): Promise<Record<string, any>>;
  }

  // Window
  interface Window {
    // JS 형식 (callback 필수)
    openSignPad(arg: { _sTargetPath: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    openCodeReader(arg: { _bMock?: boolean; _fCallback: (result: any) => void }): void;
    openFileExplorer(arg: { _bMock?: boolean; _fCallback: (result: any) => void }): void;
    openImageViewer(arg: { _sImagePath: string; _fCallback: (result: any) => void }): void;
    // TS 형식 (callback 없음, Promise 반환)
    openSignPad(arg?: { _sTargetPath: string; _bMock?: boolean }): Promise<Record<string, any>>;
    openCodeReader(arg?: { _bMock?: boolean }): Promise<Record<string, any>>;
    openFileExplorer(arg?: { _bMock?: boolean }): Promise<Record<string, any>>;
    openImageViewer(arg?: { _sImagePath: string }): Promise<Record<string, any>>;
  }

  // Contacts
  interface Contacts {
    // JS 형식 (callback 필수)
    get(arg: { _sSearchType: '' | 'name' | 'phone'; _sSearchText?: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    // TS 형식 (callback 없음, Promise 반환)
    get(arg?: { _sSearchType: '' | 'name' | 'phone'; _sSearchText?: string; _bMock?: boolean }): Promise<Record<string, any>>;
  }

  // Event
  interface Event {
    setEvent(sEvent: string, fCallback: any): void;
    clearEvent(sEvent: string): void;
  }

  // Database
  interface Database {
    // JS 형식 (callback 필수)
    beginTransaction(arg: { _bMock?: boolean; _fCallback: (result: any) => void }): void;
    // TS 형식 (callback 없음, Promise 반환)
    beginTransaction(arg?: { _bMock?: boolean }): Promise<Record<string, any>>;

    closeDatabase(arg: { _bMock?: boolean; _fCallback: (result: any) => void }): void;
    closeDatabase(arg?: { _bMock?: boolean }): Promise<Record<string, any>>;

    commitTransaction(arg: { _bMock?: boolean; _fCallback: (result: any) => void }): void;
    commitTransaction(arg?: { _bMock?: boolean }): Promise<Record<string, any>>;

    executeBatchSql(arg: { _sQuery: string; _aBindingValues?: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    executeBatchSql(arg: { _sQuery: string; _aBindingValues?: string; _bMock?: boolean }): Promise<Record<string, any>>;

    executeSelect(arg: { _sQuery: string; _aBindingValues?: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    executeSelect(arg: { _sQuery: string; _aBindingValues?: string; _bMock?: boolean }): Promise<Record<string, any>>;

    executeSql(arg: { _sQuery: string; _aBindingValues?: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    executeSql(arg: { _sQuery: string; _aBindingValues?: string; _bMock?: boolean }): Promise<Record<string, any>>;

    openDatabase(arg: { _sDbName: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    openDatabase(arg?: { _sDbName: string; _bMock?: boolean }): Promise<Record<string, any>>;

    rollbackTransaction(arg: { _bMock?: boolean; _fCallback: (result: any) => void }): void;
    rollbackTransaction(arg?: { _bMock?: boolean }): Promise<Record<string, any>>;
  }

  // Localization
  interface Localization {
    // JS 형식 (callback 필수)
    getLocale(arg: { _bMock?: boolean; _fCallback: (result: any) => void }): void;
    setLocale(arg: { _sLocaleCd: string; _bMock?: boolean; _fCallback: (result: any) => void }): void;
    // TS 형식 (callback 없음, Promise 반환)
    getLocale(arg?: { _bMock?: boolean }): Promise<Record<string, any>>;
    setLocale(arg?: { _sLocaleCd: string; _bMock?: boolean }): Promise<Record<string, any>>;
  }

  // Http
  interface Http {
    request(arg: any): any;
  }
}

declare global {
  interface Window {
    bizMOB: {
      // 전역 Config 함수들
      setConfig(target: string, className: string, arg: any): void;
      getConfig(target: string, className: string): any;

      // Event 함수들
      setEvent(sEvent: string, fCallback: any): void;
      clearEvent(sEvent: string): void;

      // 모듈들
      App: bizMOB.App;
      Config: bizMOB.Config;
      Contacts: bizMOB.Contacts;
      Database: bizMOB.Database;
      Device: bizMOB.Device;
      Event: bizMOB.Event;
      File: bizMOB.File;
      Http: bizMOB.Http;
      Localization: bizMOB.Localization;
      Logger: bizMOB.Logger;
      Network: bizMOB.Network;
      Properties: bizMOB.Properties;
      Push: bizMOB.Push;
      Storage: bizMOB.Storage;
      System: bizMOB.System;
      Window: bizMOB.Window;
    };
  }
}

// BzClass 타입 정의
declare namespace BzClass {
  // BzCrypto 클래스
  interface BzCrypto {
    // 초기화 여부 조회
    isInit(): boolean;

    // 암호화 키 조회
    getSymKey(): string | null;

    // 인증 토큰 조회
    getCryAuthToken(): string | null;

    // 인증 토큰 만료 시간 조회
    getCryAuthTokenExpTime(): string | null;

    // 갱신 토큰 조회
    getCryRefreshToken(): string | null;

    // 갱신 토큰 만료 시간 조회
    getCryRefreshTokenExpTime(): string | null;

    // BzCrypto 초기화
    init(arg: {
      crySymKey: string | null;
      cryAuthToken: string | null;
      cryAuthTokenExpTime: string | null;
      cryRefreshToken: string | null;
      cryRefreshTokenExpTime: string | null;
    }): void;

    // Auth Token 발급
    shareAuthKey(arg?: {
      _bProgressEnable?: boolean;
    }): Promise<Record<string, any>>;

    // Auth Token 갱신
    renewAuthToken(arg?: {
      _bProgressEnable?: boolean;
    }): Promise<Record<string, any>>;

    // Auth Token 발급 필요 여부
    isTokenRequired(): boolean;

    // Auth Token 만료 여부
    isTokenExpired(): boolean;
  }

  // BzToken 클래스
  interface BzToken {
    // 초기화 여부 조회
    isInit(): boolean;

    // 인증 토큰 조회
    getAccessToken(): string | null;

    // 인증 토큰 만료 시간 조회
    getAccessTokenExpTime(): string | null;

    // 갱신 토큰 조회
    getRefreshToken(): string | null;

    // 갱신 토큰 만료 시간 조회
    getRefreshTokenExpTime(): string | null;

    // JWT Token 저장
    init(arg: {
      accessToken: string;
      accessTokenExpTime: string;
      refreshToken: string;
      refreshTokenExpTime: string;
    }): void;

    // JWT Token 갱신
    renewToken(arg?: {
      _bProgressEnable?: boolean;
    }): Promise<Record<string, any>>;

    // JWT Token 만료 여부
    isTokenExpired(): boolean;
  }

  // BzLocale 클래스
  interface BzLocale {
    // 로케일 초기화
    initLocale(): Promise<void>;

    // 현재 로케일 조회
    getLocale(): Promise<any>;

    // 로케일 변경
    changeLocale(newLocaleCd: string): void;
  }
}

// BzClass들을 전역에서 사용할 수 있도록 선언
declare global {
  const BzCrypto: BzClass.BzCrypto;
  const BzToken: BzClass.BzToken;
  const BzLocale: BzClass.BzLocale;
}

export { };
