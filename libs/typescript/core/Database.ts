export default class Database {
  /** 트랜잭션을 시작합니다. */
  static beginTransaction(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.beginTransaction({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 사용중인 SQlite 데이터베이스를 닫아줍니다. */
  static closeDatabase(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.closeDatabase({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 트랜잭션을 커밋합니다. */
  static commitTransaction(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.commitTransaction({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** SQL쿼리문을 일괄 실행합니다. */
  static executeBatchSql(arg: {
    _sQuery: string, // SQL 쿼리문
    _aBindingValues?: string, // SQL 쿼리문의 바인딩 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.executeBatchSql({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** SELECT SQL쿼리문을 실행합니다. */
  static executeSelect(arg: {
    _sQuery: string, // SQL 쿼리문
    _aBindingValues?: string, // SQL 쿼리문의 바인딩 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.executeSelect({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** SQL쿼리문을 실행합니다. */
  static executeSql(arg: {
    _sQuery: string, // SQL 쿼리문
    _aBindingValues?: string, // SQL 쿼리문의 바인딩 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.executeSql({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** SQLite 데이터베이스를 사용할 수 있도록 열어줍니다. */
  static openDatabase(arg: {
    _sDbName: string, // 오픈할 대상 데이터베이스 이름
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.openDatabase({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 트랜잭션을 롤백합니다. */
  static rollbackTransaction(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.rollbackTransaction({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }
}
