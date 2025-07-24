const bizMOB: any = window.bizMOB;

export default class Logger {
    /** info Level 로그 */
    static info(_sMessage: string): void {
        bizMOB.Logger.info(_sMessage);
    }

    /** log Level 로그 */
    static log(_sMessage: string): void {
        bizMOB.Logger.log(_sMessage);
    }

    /** warn Level 로그 */
    static warn(_sMessage: string): void {
        bizMOB.Logger.warn(_sMessage);
    }

    /** debug Level 로그 */
    static debug(_sMessage: string): void {
        bizMOB.Logger.debug(_sMessage);
    }

    /** error Level 로그 */
    static error(_sMessage: string): void {
        bizMOB.Logger.error(_sMessage);
    }
}