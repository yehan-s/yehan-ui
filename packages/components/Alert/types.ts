export type AlertType = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  title?: string
  description?: string
  type: AlertType
  closable?: boolean
  closeText?: string
  showIcon?: boolean
  center?: boolean
  effect?: 'light' | 'dark'
}

export interface AlertEmits {
  (e: 'close'): void
  (e: 'open'): void
}

export interface AlertInstance {
  open(): void
  close(): void
}
