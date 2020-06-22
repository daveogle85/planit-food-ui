export enum FeedbackStatus {
  ERROR = 'Error',
  WARN = 'Warn',
  INFO = 'Info',
  DISABLED = 'Disabled',
  HIDDEN = 'Hidden',
}

export type ErrorState = {
  status: FeedbackStatus;
  message?: string;
};

export type ToastState = ErrorState & {
  popped: boolean;
};
