export default class Config {
  /** bizMOB Class Config Set */
  static set(target: string, className: string, arg: any) {
    window.bizMOB.setConfig(target, className, arg);
  }

  /** bizMOB Class Config Get */
  static get(target: string, className: string) {
    return window.bizMOB.getConfig(target, className);
  }
}
