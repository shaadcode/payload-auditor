// import type { TaskConfig, TaskHandler } from 'payload'

// import type { PluginOptions } from './../../../types/pluginOptions.js'
// import type { Duration } from './../../../utils/toMS.js'

// import { defaultCleanupTaskValues } from './../../../Constant/automation.js'
// import ms from './../../../utils/toMS.js'

// export type DeleteOldLogResultTask = {
//   input: {
//     olderThan: Duration
//     pluginOpts: PluginOptions
//     slug: string
//   }
//   output: {
//     deletedBefore: string
//     deletedCount: number
//   }
// }

// export const deleteOldLogHandler: TaskHandler<DeleteOldLogResultTask> = ({ input, req }) => {
//   const olderThanMileSeconds = ms(input.olderThan)
//   //   if (input.pluginOpts.automation?.logCleanup.strategy === 'time') {
//   //     const deletedData = await req.payload.delete({
//   //       collection: input.slug,
//   //       where: {
//   //         createdAt: {
//   //           less_than: new Date(Date.now() - olderThanMileSeconds),
//   //         },
//   //       },
//   //     })
//   //     if (deletedData.errors && deletedData.errors.length > 0) {
//   //       deletedData.errors.forEach((item) => console.error(item))
//   //       return {
//   //         errorMessage: 'Delete operation failed. See logs for details.',
//   //         state: 'failed',
//   //       }
//   //     }
//   //   }

//   // if (input.pluginOpts.automation?.logCleanup.strategy?.name === 'count') {
//   //   const totalLogs = await req.payload.find({
//   //     collection: input.pluginOpts.collection?.slug ?? defaultCollectionValues.slug,
//   //     limit: 0,
//   //   })

//   //   if (totalLogs.totalDocs > input.pluginOpts.automation.logCleanup.strategy.amountToDelete) {
//   //     const logsToDelete = await req.payload.find({
//   //       collection: input.pluginOpts.collection?.slug ?? defaultCollectionValues.slug,
//   //       limit:
//   //         input.pluginOpts.automation.logCleanup.strategy.deletionCount ??
//   //         defaultAutomationLogCleanup.deletionCount,
//   //       sort: 'createdAt', // قدیمی‌ترین‌ها اول
//   //     })

//   //     // آی‌دی‌ها رو استخراج کن
//   //     const idsToDelete = logsToDelete.docs.map((log) => log.id)

//   //     // حذف کن بر اساس آیدی‌ها (بدون limit)
//   //     const deletedLogs = await req.payload.delete({
//   //       collection: input.pluginOpts.collection?.slug ?? defaultCollectionValues.slug,
//   //       where: {
//   //         id: {
//   //           in: idsToDelete,
//   //         },
//   //       },
//   //     })

//   //   }
//   // }
//   console.log('run')
//   return {
//     output: {
//       deletedBefore: new Date(olderThanMileSeconds).toISOString(),
//       deletedCount: 5,
//     },
//     state: 'succeeded',
//   }
// }

// export const deleteOldLogTask = (pluginOpts: PluginOptions): TaskConfig<DeleteOldLogResultTask> => {
//   const slug = pluginOpts.automation?.logCleanup.taskConfig?.slug ?? defaultCleanupTaskValues.slug
//   const handler = pluginOpts.automation?.logCleanup.taskConfig?.handler ?? deleteOldLogHandler
//   const inputSchema =
//     pluginOpts.automation?.logCleanup.taskConfig?.inputSchema ??
//     defaultCleanupTaskValues.defaultInput
//   const interfaceName =
//     pluginOpts.automation?.logCleanup.taskConfig?.interfaceName ??
//     defaultCleanupTaskValues.interfaceName
//   const outputSchema =
//     pluginOpts.automation?.logCleanup.taskConfig?.outputSchema ??
//     defaultCleanupTaskValues.defaultOutput
//   const retries =
//     pluginOpts.automation?.logCleanup.taskConfig?.retries ?? defaultCleanupTaskValues.retries
//   const label =
//     pluginOpts.automation?.logCleanup.taskConfig?.label ?? defaultCleanupTaskValues.label
//   const onFail =
//     pluginOpts.automation?.logCleanup.taskConfig?.onFail ?? defaultCleanupTaskValues.defaultOnFail
//   const onSuccess =
//     pluginOpts.automation?.logCleanup.taskConfig?.onSuccess ??
//     defaultCleanupTaskValues.defaultOnSuccess
//   return {
//     slug,
//     handler,
//     inputSchema,
//     interfaceName,
//     label,
//     onFail,
//     onSuccess,
//     outputSchema,
//     retries,
//   }
// }
