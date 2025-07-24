const bizMOB: any = window.bizMOB;

export default class Device {
    /** 디바이스 정보 조회 */
    static getInfo(arg?: {
        _sKey: string // Device Info Key
    }) {
        return bizMOB.Device.getInfo({
            ...arg
        });
    }

    /** App 판단 여부 */
    static isApp() {
        return bizMOB.Device.isApp();
    }

    /** Web 판단 여부 */
    static isWeb() {
        return bizMOB.Device.isWeb();
    }

    /** Mobile 판단 여부 */
    static isMobile() {
        return bizMOB.Device.isMobile();
    }

    /** PC 판단 여부 */
    static isPC() {
        return bizMOB.Device.isPC();
    }

    /** Android 여부 */
    static isAndroid() {
        return bizMOB.Device.isAndroid();
    }

    /** IOS 여부 */
    static isIOS() {
        return bizMOB.Device.isIOS();
    }

    /** Tablet 여부 */
    static isTablet() {
        return bizMOB.Device.isTablet();
    }

    /** Phone 여부 */
    static isPhone() {
        return bizMOB.Device.isPhone();
    }
}