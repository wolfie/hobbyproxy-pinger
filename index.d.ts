declare const startPinger: (
  /** @example
   *```
   * {
   *     hobbyproxyAddress: 'http://192.168.1.1:8080',
   *     hostname: 'this-service.mydomain.tld',
   *     target: ':8080'
   * } */
  opts: {
    /** @example 'http://192.168.1.1:8080' */
    hobbyproxyAddress: string;
    /** @example 'this-service.mydomain.tld' */
    hostname: string;
    /** @example 'http://192.168.1.2:8080', ':8080' */
    target?: `http://${string}` | `:${number}`;
    /** @example 7 */
    staleInDays?: number;
    /** @example { hours: 24 } */
    interval?: { days?: number; hours?: number };
    /** @example console */
    logger?: { log: (...args: any[]) => void; error: (...args: any[]) => void };
  }
) => { stop: () => void };

export default startPinger;
