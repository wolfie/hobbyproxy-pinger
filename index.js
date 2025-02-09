/**
 * @typedef {object} Interval
 * @prop {number} [days]
 * @prop {number} [hours]
 */

/**
 * @typedef {object} Opts
 * @prop {string} hobbyproxyAddress
 * @prop {string} hostname
 * @prop {string} [target]
 * @prop {number} [staleInDays]
 * @prop {Interval} [interval]
 * @prop {{ log: (...args: any[]) => void; error: (...args: any[]) => void }} [logger]
 */

/**
 * @param {Pick<Opts,'hobbyproxyAddress'|'hostname'|'staleInDays'|'target'|'logger'>} opts
 * @return {()=>Promise<void>}
 */
const createPinger =
  ({ hobbyproxyAddress, hostname, staleInDays, target, logger }) =>
  async () => {
    try {
      const jsonString = JSON.stringify({ hostname, target, staleInDays });
      logger?.log(
        `Pinging Hobbyproxy at ${hobbyproxyAddress} with ${jsonString}`
      );
      const result = await fetch(hobbyproxyAddress, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostname, target, staleInDays }),
      });
      logger?.log(`${result.status}: ${JSON.stringify(await result.json())}`);
    } catch (e) {
      logger?.error(e);
    }
  };

/**
 * @param {Interval} interval
 * @return {number}
 */
const intervalToMillis = (interval) => {
  let millis = 0;
  millis += (interval.days ?? 0) * 86400000;
  millis += (interval.hours ?? 0) * 3600000;
  return millis;
};

/**
 * @param {Opts} opts
 * @returns {{stop:()=>void}}
 */
const startPinger = ({
  hobbyproxyAddress,
  hostname,
  interval = { hours: 12 },
  staleInDays,
  target,
  logger,
}) => {
  if (!hobbyproxyAddress.startsWith("http://")) {
    throw new Error(
      `Use a 'http://' address for contacting Hobbyproxy (got ${JSON.stringify(
        hobbyproxyAddress
      )})`
    );
  }

  logger?.log("Starting Hobbyproxy pinger");
  const pinger = createPinger({
    hobbyproxyAddress,
    hostname,
    staleInDays,
    target,
    logger,
  });

  pinger();

  const intervalMillis = intervalToMillis(interval);
  const intervalId = globalThis.setInterval(pinger, intervalMillis);
  return {
    stop: () => {
      logger?.log("Stopping Hobbyproxy pinger");
      clearInterval(intervalId);
    },
  };
};

export default startPinger;
