export default class Contacts {
  /** 연락처 조회 */
  static get(arg: {
    _sSearchType: '' | 'name' | 'phone', // 주소록 검색 타입. "" or name or phone
    _sSearchText?: string, // 주소록 검색어
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Contacts.get({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }
}
