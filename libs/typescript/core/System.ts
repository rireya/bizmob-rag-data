export default class System {
  /** 단말기의 브라우저를 호출합니다. */
  static callBrowser(arg: {
    _sURL: string, // 호출할 URL
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<void> {
    return new Promise(resolve => {
      window.bizMOB.System.callBrowser({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 디바이스의 카메라를 이용하여 사진을 찍습니다. */
  static callCamera(arg: {
    _sFileName?: string, // 찍은 이미지를 저장할 이름
    _sDirectory?: string, // 찍은 이미지를 저장할 경로
    _bAutoVerticalHorizontal: boolean, // 찍은 이미지를 화면에 맞게 자동으로 회전시켜 저장할지를 설정하는 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.callCamera({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 디바이스의 사진앨범(갤러리)를 호출합니다. */
  static callGallery(arg: {
    _sType: 'all' | 'image' | 'video', // 러리에서 불러올 미디어 타입
    _nMaxCount?: number, // 선택 가능 개수
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.callGallery({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 디바이스의 지도(Map) 앱을 호출하여 보여줍니다. */
  static callMap(arg: {
    _sLocation: string, // 위치 정보 값 (Ex. "37.541, 126.986")
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.callMap({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 문자(SMS) 발송 화면을 열어줍니다. */
  static callSMS(arg: {
    _aNumber: string[], // 문자보낼 전화번호 목록 (Ex. ["01012345678", "01012345679"])
    _sMessage?: string, // 문자 메세지 내용 (문자 발송 화면에서 미리 입력되어 있을 문구)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.callSMS({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 디바이스의 전화걸기 기능을 수행합니다. */
  static callTEL(arg: {
    _sNumber: string, // 전화할 전화번호 (Ex. "01012345678")
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.callTEL({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 디바이스의 현재 GPS정보를 가져옵니다. */
  static getGPS(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.getGPS({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }
}
