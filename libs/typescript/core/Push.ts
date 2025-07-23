export default class Push {
  /** 푸시 서버로부터 설정된 푸시 알람을 가져옵니다. */
  static getAlarm(arg: {
    _sUserId: string, // 푸시 알림이 설정된 사용자 아이디
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.getAlarm({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 푸시 메세지 목록을 가져옵니다. */
  static getMessageList(arg: {
    _sUserId: string, // 푸시 메세지를 가져올 사용자 이이디
    _nPageIndex: number, // 푸시 메세지를 가져올 페이지 번호
    _nItemCount: number, // 해당 페이지에서 가져올 푸시 메세지 갯수
    _sAppName: string, // 푸시 메세지를 가져올 앱 이름
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.getMessageList({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 푸시키를 받아옵니다. */
  static getPushKey(arg?: {
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.getPushKey({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 읽지 않은 푸시 메세지 갯수를 가져옵니다. */
  static getUnreadCount(arg: {
    _sUserId: string, // 읽지 않은 메세지를 가져올 사용자 아이디
    _sAppName: string, // 푸시 메세지를 가져올 앱 이름
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.getUnreadCount({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 푸시 메세지를 읽음 처리 합니다. */
  static readMessage(arg: {
    _sTrxDay: string, // 푸시 메세지를 읽은 날짜(yyyymmdd 형식)
    _sTrxId: string, // 푸시 메세지 아이디
    _sUserId: string, // 푸시 메세지를 읽음 처리할 사용자 아이디
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.readMessage({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 수신받은 푸시 메세지의 상세 정보를 조회합니다. */
  static readReceiptMessage(arg: {
    _sUserId: string, // 수신받은 메세지를 조회할 사용자 아이디
    _sMessageId: string, // 조회할 수신 메시지의 아이디
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.readReceiptMessage({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 푸시키를 서버에 등록합니다. */
  static registerToServer(arg: {
    _sServerType: 'bizpush' | 'push', // 푸시키를 등록할 서버 타입입니다. bizpush(대용량 푸시 서버)와 push(일반 푸시 서버)
    _sUserId: string, // 푸시키를 등록할 사용자의 아이디
    _sAppName: string, // 푸시키를 등록할 앱 이름
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.registerToServer({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 디바이스에 저장된 푸시 등록 관련 정보를 리셋합니다. */
  static reset(): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.reset({
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 푸시 메세지를 전송합니다. */
  static sendMessage(arg: {
    _sAppName: string, // 푸시 메세지 보낼 앱 이름
    _aUsers: string[], // 푸시 메세지 받을 사용자 목록
    _sFromUser: string, // 푸시 메세지를 보낼 사용자 아이디
    _sSubject: string, // 푸시 메세지 제목
    _sContent: string, // 푸시 메세지 내용
    _sTrxType: 'INSTANT' | 'SCHEDULE', // 푸시 메세지 전송 타입입니다. INSTANT(즉시 전송), SCHEDULE(예약 전송)
    _sScheduleDate?: string, // 푸시 메세지를 예약 전송할 경우 전송 날짜(yyyymmdd 형식)
    _aGroups?: string[], // 푸시 메세지를 받을 그룹 목록
    _bToAll?: boolean, // (Default : false) 해당 앱을 사용하는 전체 사용자가 푸시 메세지를 받을지 설정하는 값
    _sCategory?: string, // (Default : def) 푸시 메세지 카테고리
    _oPayLoad?: Record<string, any>, // 푸시 메시지 전송시 기본 용량이 초과 할 경우 전송할 메세지
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.sendMessage({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 푸시 알람을 설정합니다. */
  static setAlarm(arg: {
    _sUserId: string, // 푸시 알람을 설정할 사용자 이이디
    _bEnabled: boolean, // 알람 설정 값입니다. true와 false로 설정이 가능
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.setAlarm({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 벳지 카운트를 설정합니다. */
  static setBadgeCount(arg: {
    _nBadgeCount: number, // 뱃지에 표시할 수를 설정합니다. 양수(표시할 갯수), 0(뱃지 카운트 표시 삭제)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.setBadgeCount({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }
}
