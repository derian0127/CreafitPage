type ToastListener = (msg: string) => void;

let listener: ToastListener | null = null;

export function showToast(msg: string) {
  listener?.(msg);
}

export function setToastListener(fn: ToastListener | null) {
  listener = fn;
}
