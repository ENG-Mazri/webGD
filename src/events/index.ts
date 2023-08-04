// interface EventRegistry {
//     [id: string]: (...args: any[]) => void
// }

// const eventStack: EventRegistry = {};

// interface Evnt {
//     register: (eventName: string, callback: Function) => void;
//     unregister: (eventName: string, callback: Function) => void;
//     dispatch: (eventName: string, ...args: any[]) => void;
// }
  
// declare module '@vue/runtime-core' {
//     interface ComponentCustomProperties {
//         $evnt: VueEventMethods;
//     }
// }
import { useEventBus } from '@vueuse/core'

export const Generation_completed = new Event("generation_completed");
export const show_chart_event = new Event("show_chart");
export const glb_event = new Event("glb_set");
export enum GDEvents {
    Generation_completed = "onGenCompleted",
    Generation_visual_set = "onGenVisualSet",
}

export const GenFinished = useEventBus<string>('GenFinished');
export const GlbUpdated = useEventBus<string>('GlbUpdated');
export const BuildViewer = useEventBus<string>('BuildViewer');
export const DestroyViewer = useEventBus<string>('DestroyViewer');

