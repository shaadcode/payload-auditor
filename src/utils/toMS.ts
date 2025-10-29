import { cleanupStrategiesDefaultValues } from './../Constant/automation.js';

export type Duration = `${number}${'d' | 'h' | 'm' | 'mo' | 's' | 'w' | 'y'}`;
const ms = (duration: Duration = cleanupStrategiesDefaultValues.manual.olderThan): number => {
  const match = /^(\d+)([smhdwy]|mo)$/.exec(duration);

  if (!match) {
    throw new Error('Invalid duration format (e.g., \'5m\', \'2h\', \'1d\', \'1mo\', \'1y\')');
  }

  const value = Number.parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'd':
      return value * 1000 * 60 * 60 * 24;
    case 'h':
      return value * 1000 * 60 * 60;
    case 'm':
      return value * 1000 * 60;
    case 'mo':
      return value * 1000 * 60 * 60 * 24 * 30;
    case 's':
      return value * 1000;
    case 'w':
      return value * 1000 * 60 * 60 * 24 * 7;
    case 'y':
      return value * 1000 * 60 * 60 * 24 * 365;
    default:
      return value * 1000 * 60 * 60 * 24 * 30;
  }
};

export default ms;
