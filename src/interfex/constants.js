import { TimeSpan } from './TimeSpan'

export const NormalWorkTime = TimeSpan.fromHours(7.9);


export const NormalBreakTime = TimeSpan.fromHours(0.5);
export const ExtendedBreakTime = TimeSpan.fromHours(0.75);


export const NormalWorkTimeLimit = TimeSpan.fromHours(6.49);
export const ExtendedWorkTimeLimit = TimeSpan.fromHours(9.24);