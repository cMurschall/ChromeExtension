import { TimeSpan } from './TimeSpan'

export const NormalWorkTime = TimeSpan.fromHours(37.5/5.0);


export const NormalBreakTime = TimeSpan.fromHours(0.5);
export const ExtendedBreakTime = TimeSpan.fromHours(0.75);


export const NormalWorkTimeLimit = new TimeSpan(6, 30);
export const ExtendedWorkTimeLimit = new TimeSpan(9, 15);