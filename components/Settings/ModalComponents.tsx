import React from 'react'

import { css, cx } from '@emotion/css'
import alertTriangle from '@iconify/icons-tabler/alert-triangle'
import infoCircle from '@iconify/icons-tabler/info-circle'
import questionCircle from '@iconify/icons-tabler/question-circle'
import { Icon } from '@iconify/react'

import styles from './ImportModal.module.scss'

export const Warning = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mb-4 flex flex-col overflow-hidden rounded-md bg-rose-900 py-2 px-4">
      <h3 className="absolute top-0 left-0 right-0 z-0 flex bg-brand-dark py-2 px-4 font-body text-xl font-bold text-white">
        <Icon icon={alertTriangle} className="mr-1 h-6 w-6" />
        Warning
      </h3>
      <div className="absolute right-0 z-0">
        <Icon icon={alertTriangle} className="h-16 w-16 text-white/25" />
      </div>
      <div className="z-10 mt-10">
        <span className="text-base text-gray-100">{children}</span>
      </div>
    </div>
  )
}

export const Tip = ({ children }: { children: React.ReactNode }) => {
  return (
    <fieldset
      className={cx(
        'rounded-md border-2 border-cyan-400 px-2 pb-2 pt-0.5 text-sm text-gray-400',
        css`
          filter: drop-shadow(0 0 2rem rgba(165, 243, 252, 0.25)) drop-shadow(0 0 0.25rem rgba(165, 243, 252, 0.3));
        `
      )}
    >
      <legend className="inline-flex items-center justify-center rounded-md border border-cyan-400 bg-slate-700 px-2 py-0.5 font-monospace text-cyan-400">
        <Icon icon={infoCircle} className="mr-1 h-5 w-5" inline={true} />
        <b>TIP</b>
      </legend>
      {children}
    </fieldset>
  )
}

export const Hint = ({ children }: { children: React.ReactNode }) => {
  return (
    <fieldset
      className={cx(
        'rounded-md border-2 border-green-700 px-2 pb-2 pt-0.5',
        css`
          filter: drop-shadow(0 0 2rem rgba(165, 243, 252, 0.25)) drop-shadow(0 0 0.25rem rgba(165, 243, 252, 0.3));
        `
      )}
    >
      <legend className="inline-flex items-center justify-center rounded-md border border-green-700 bg-green-900 px-2 py-0.5 font-monospace text-green-300">
        <Icon icon={questionCircle} className="mr-1 h-5 w-5" inline={true} />
        <b>HINT</b>
      </legend>
      <div className="m-2 text-gray-300">{children}</div>
    </fieldset>
  )
}

export const Separator = () => {
  return (
    <span
      className={cx(
        'mx-auto inline-flex items-center justify-center py-2 text-sm italic text-gray-400',
        css`
          &::before {
            content: '';
            display: inline-block;
            width: 6rem;
            height: 1px;
            background-color: rgb(8, 145, 178);
            margin-right: 0.5rem;
          }
          &::after {
            content: '';
            display: inline-block;
            width: 6rem;
            height: 1px;
            background-color: rgb(8, 145, 178);
            margin-left: 0.5rem;
          }
        `
      )}
    >
      or
    </span>
  )
}

export const InlineSeparator = () => {
  return (
    <span
      className={cx(
        'mx-4 inline-flex items-center justify-center py-2 text-sm italic text-gray-400',
        css`
          &::before {
            content: '';
            display: inline-block;
            width: 0.5rem;
            height: 1px;
            background-color: rgb(8, 145, 178);
            margin-right: 0.5rem;
          }
          &::after {
            content: '';
            display: inline-block;
            width: 0.5rem;
            height: 1px;
            background-color: rgb(8, 145, 178);
            margin-left: 0.5rem;
          }
        `
      )}
    >
      or
    </span>
  )
}
