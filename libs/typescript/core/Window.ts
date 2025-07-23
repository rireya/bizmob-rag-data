export default class Window {
  /** 사인패드 열기 */
  static openSignPad(arg: {
    _sTargetPath: string, // 사인패드 이미지 저장 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Window.openSignPad({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 바코드, QR코드 리더 열기 */
  static openCodeReader(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Window.openCodeReader({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 탐색기 열기 */
  static openFileExplorer(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Window.openFileExplorer({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 이미지 뷰어 열기 */
  static openImageViewer(arg: {
    _sImagePath: string, // 이미지 뷰어로 열 이미지 경로
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Window.openImageViewer({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }
}
