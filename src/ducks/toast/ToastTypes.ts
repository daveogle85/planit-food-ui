export enum FeedbackStatus {
  ERROR = 'Error',
  WARN = 'Warn',
  INFO = 'Info',
  DISABLED = 'Disabled',
  HIDDEN = 'Hidden',
}

export type ToastState = {
  status: FeedbackStatus;
  message?: string;
};
