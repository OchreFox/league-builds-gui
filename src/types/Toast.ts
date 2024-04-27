import { IconifyIcon } from '@iconify/react'

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Default = 'default',
}

export interface Toast {
  title: string
  message: string
  type: NotificationType
  icon?: IconifyIcon
}

export const defaultToast: Toast = {
  title: '',
  message: '',
  type: NotificationType.Default,
}

export interface ToastProps extends Toast {
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}
