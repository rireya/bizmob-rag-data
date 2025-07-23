/**
 * Event 목록
 * - open : 페이지(웹뷰)를 열었을 때 (bizMOB4에서는 단일 웹뷰라 사용 안함)
 * - close : 페이지(웹뷰)를 닫았을 때 (bizMOB4에서는 단일 웹뷰라 사용 안함)
 * - beforeready : 페이지(웹뷰)가 로드되기 전 (bizMOB4에서는 단일 웹뷰라 사용 안함)
 * - ready : 페이지(웹뷰)가 로드되었을 때 (bizMOB4에서는 단일 웹뷰라 사용 안함)
 * - backbutton : Back Button이 눌러졌을 때 (for Android)
 * - resume : 페이지(웹뷰)가 활성화 되었을 때(= focus가 맞추어졌을때, 화면상으로 드러났을때)
 * - push : Push 메세지를 수신하였을 때
 * - networkstatechange : 네트워크 상태가 변경되었을 때
 */
export default class Event {
  /**
   * Native 이벤트 설정 (기존 이벤트 목록 덮어쓰기)
   * @param sEvent Native 이벤트 명
   * @param fCallback Callback 함수 or 이름
   */
  static setEvent(sEvent: string, fCallback: any): void {
    return window.bizMOB.setEvent(sEvent, fCallback);
  }

  /**
   * Native 이벤트 전체 제거
   * @param sEvent Native 이벤트 명
   */
  static clearEvent(sEvent: string): void {
    return window.bizMOB.clearEvent(sEvent);
  }
}
