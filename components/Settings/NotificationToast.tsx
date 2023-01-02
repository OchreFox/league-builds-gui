import { cx } from '@emotion/css'
import { Transition } from '@headlessui/react'
import questionCircle from '@iconify/icons-tabler/question-circle'
import xIcon from '@iconify/icons-tabler/x'
import { Icon, IconifyIcon } from '@iconify/react'
import React, { Fragment, useState } from 'react'
import { NotificationType, ToastProps } from 'types/Toast'

export const textClass: {
  [key in NotificationType]: string
} = {
  [NotificationType.Success]: 'text-green-500',
  [NotificationType.Error]: 'text-red-500',
  [NotificationType.Info]: 'text-blue-500',
  [NotificationType.Warning]: 'text-yellow-500',
  [NotificationType.Default]: 'text-gray-500',
}

export const contextClass = {
  success: 'bg-green-50 border-green-500',
  error: 'bg-red-100 border-red-500',
  info: 'bg-blue-50 border-blue-500',
  warning: 'bg-yellow-50 border-yellow-500',
  default: 'bg-gray-50 border-gray-500',
}

const NotificationToast = ({
  title,
  message,
  type = NotificationType.Default,
  icon = questionCircle,
  show,
  setShow,
}: ToastProps) => {
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={cx(
                'max-w-md w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border',
                contextClass[type]
              )}
            >
              <div className="p-4">
                <div className="flex items-start text-left">
                  <div className="flex-shrink-0">
                    <Icon icon={icon} className={cx('h-6 w-6', textClass[type])} inline={true} />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className={cx('text-md font-body font-semibold', textClass[type])}>{title}</p>
                    <p className="mt-1 text-sm text-gray-800">{message}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        setShow(false)
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <Icon icon={xIcon} className="h-6 w-6" inline={true} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}

export const ToastBody = ({
  title,
  message,
  icon = questionCircle,
  type,
}: {
  title: string
  message?: string
  icon?: IconifyIcon
  type: NotificationType
}) => {
  return (
    <div className="p-4">
      <div className="flex items-start text-left">
        <div className="flex-shrink-0">
          <Icon icon={icon} className={cx('h-6 w-6', textClass[type])} inline={true} />
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className={cx('text-md font-body font-semibold', textClass[type])}>{title}</p>
          {message && <p className="mt-1 text-sm text-gray-200 font-sans">{message}</p>}
        </div>
      </div>
    </div>
  )
}

export default NotificationToast
