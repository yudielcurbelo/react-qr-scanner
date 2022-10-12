export default function on<T extends Window | Document | HTMLElement | EventTarget>(
    obj: T | null,
    ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
    if (obj && obj.addEventListener) {
        obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>));
    }
}