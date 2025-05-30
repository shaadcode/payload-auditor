import type { ManualStrategy } from './../types/pluginOptions.js'

// export const defaultAutomationValues =
//   // PluginOptions['automation']
//   {
//     logCleanup: {
//       schedule: {
//         cron: '* * * * *',
//         limit: 100,
//         queue: 'testRun',
//       },
//       strategy: { name: 'count', amountToDelete: 100, deletionCount: 50 },
//     },
//   }

export const cleanupStrategiesDefaultValues = {
  // count: {
  //   name: 'count',
  //   amountToDelete: 100,
  //   deletionCount: 50,
  // } as CountStrategy,
  manual: { name: 'manual', amount: 200, olderThan: '1w' } as Required<ManualStrategy>,
  // time: {
  //   name: 'time',
  //   olderThan: '30s',
  // } as TimeStrategy,
}

// export const defaultCleanupTaskValues = {
//   defaultInput: [
//     {
//       name: 'slug',
//       type: 'text',
//       defaultValue: 'empty',
//       required: true,
//     },
//     {
//       name: 'olderThan',
//       type: 'text',
//       defaultValue: '665m',
//       required: true,
//     },
//   ] as Field[],

//   defaultOutput: [
//     {
//       name: 'deletedBefore',
//       type: 'date',
//     },
//     {
//       name: 'deletedCount',
//       type: 'number',
//     },
//   ] as Field[],

//   slug: 'payloadAuditor:DeleteOldLog',
//   defaultOnFail: (() => {}) as TaskConfig['onFail'],
//   defaultOnSuccess: (() => {}) as TaskConfig['onSuccess'],
//   interfaceName: 'DeleteOldLogTask',
//   label: 'Delete Old Logs',
//   retries: 2,
// }
