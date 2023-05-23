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

export const event = new Event("generation_completed");
export const show_chart_event = new Event("show_chart");