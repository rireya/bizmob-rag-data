const bizMOB: any = window.bizMOB;

export default class Config {
    /** bizMOB Class Config Set */
    static set(target: string, className: string, arg: any) {
        bizMOB.setConfig(target, className, arg);
    }

    /** bizMOB Class Config Get */
    static get(target: string, className: string) {
        return bizMOB.getConfig(target, className);
    }
}