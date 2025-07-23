export default class Device {
  /** 디바이스 정보 조회 */
  static getInfo(arg?: {
    _sKey: string // Device Info Key
  }) {
    return arg ? window.bizMOB.Device.getInfo(arg) : window.bizMOB.Device.getInfo();
  }

  /** App 판단 여부 */
  static isApp() {
    return window.bizMOB.Device.isApp();
  }

  /** Web 판단 여부 */
  static isWeb() {
    return window.bizMOB.Device.isWeb();
  }

  /** Mobile 판단 여부 */
  static isMobile() {
    return window.bizMOB.Device.isMobile();
  }

  /** PC 판단 여부 */
  static isPC() {
    return window.bizMOB.Device.isPC();
  }

  /** Android 여부 */
  static isAndroid() {
    return window.bizMOB.Device.isAndroid();
  }

  /** IOS 여부 */
  static isIOS() {
    return window.bizMOB.Device.isIOS();
  }

  /** Tablet 여부 */
  static isTablet() {
    return window.bizMOB.Device.isTablet();
  }

  /** Phone 여부 */
  static isPhone() {
    return window.bizMOB.Device.isPhone();
  }
}
