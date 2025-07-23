export default class File {
  /** 파일 복사 */
  static copy(arg: {
    _sSourcePath: string, // 복사할 파일의 경로
    _sTargetPath: string, // 복사될 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.copy({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 디렉토리 정보 조회 */
  static directory(arg: {
    _sDirectory: string, // 디렉토리 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.directory({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 다운로드 */
  static download(arg: {
    _aFileList: {
    _sURI: string, // 다운로드 URI
    _bOverwrite: boolean, // 덮어쓰기 여부
    _sFileName: string, // 파일 이름
    _sDirectory: string, // 다운로드 경로
    }[],
    _sMode: 'foreground' | 'background', // 파일 다운로드 모드(foreground, background)
    _sProgressBar: 'off' | 'each' | 'full', // 다운로드할 때 프로그래스바 설정 값(off , each, full)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.download({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 존재여부 확인 */
  static exist(arg: {
    _sSourcePath: string, // 존재 여부를 확인할 파일 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.exist({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 정보 조회 */
  static getInfo(arg: {
    _aFileList: {
    _sSourcePath: string, // 파일의 경로
    }[],
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>[]> {
    return new Promise(resolve => {
      window.bizMOB.File.getInfo({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 이동 */
  static move(arg: {
    _sSourcePath: string, // 이동할 파일의 경로
    _sTargetPath: string, // 이동될 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.move({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 Open */
  static open(arg: {
    _sSourcePath: string, // 열어서 보여줄 대상 파일 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.open({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 삭제 */
  static remove(arg: {
    _aSourcePath: string[], // 삭제할 파일목록
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.remove({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 이미지 리사이즈 */
  static resizeImage(arg: {
    _aFileList: {
        _sSourcePath: string
    }[],
    _bIsCopy: boolean, // 파일 Copy 여부
    _sTargetDirectory: string, // 리사이즈 파일 경로
    _nCompressRate: number, // 파일 축소 비율
    _nWidth: number, // width 변경 값
    _nHeight: number, // height 변경 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.resizeImage({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 회전 */
  static rotateImage(arg: {
    _sSourcePath: string, // 회전시킬 이미지 파일 경로
    _sTargetPath: string, // 회전된 이미지가 저장될 파일 경로
    _nOrientation: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, // 회전 시킬 각도(EXIF_Orientation)값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.rotateImage({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 압축풀기 */
  static unzip(arg: {
    _sSourcePath: string, // 회전시킬 이미지 파일 경로
    _sDirectory: string, // 디렉토리 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.unzip({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 업로드 */
  static upload(arg: {
    _aFileList: {
      _sSourcePath: string, // 업로드할 파일의 경로
      _sFileName: string, // 업로드할 파일의 이름
    }[],
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.upload({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 파일 풀기 */
  static zip(arg: {
    _sSourcePath: string, // 압축할 파일의 경로
    _sTargetPath: string, // 압축된 파일이 저장될 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.zip({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }
}
