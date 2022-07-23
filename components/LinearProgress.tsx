import { css, cx } from '@emotion/css'
import { motion } from 'framer-motion'
import React from 'react'

const LinearProgress = ({ show }: { show: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ type: 'tween', ease: [0.87, 0, 0.13, 1], duration: 0.2 }}
      className="absolute z-20 w-full overflow-hidden bg-transparent"
    >
      <span className="relative block h-1 overflow-hidden" role="progressbar">
        <span
          className={cx(
            'absolute inset-0 w-full bg-brand-light transition duration-200',
            css`
              transform-origin: left;
              width: auto;
              animation: scroll-1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;

              @keyframes scroll-1 {
                0% {
                  left: -35%;
                  right: 100%;
                }

                60% {
                  left: 100%;
                  right: -90%;
                }
                100% {
                  left: 100%;
                  right: -90%;
                }
              }
            `
          )}
        />
        <span
          className={cx(
            'absolute inset-0 w-full bg-brand-light transition duration-200',
            css`
              transform-origin: left;
              width: auto;
              animation: scroll-2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;

              @keyframes scroll-2 {
                0% {
                  left: -200%;
                  right: 100%;
                }

                60% {
                  left: 107%;
                  right: -8%;
                }
                100% {
                  left: 107%;
                  right: -8%;
                }
              }
            `
          )}
        />
      </span>
    </motion.div>
  )
}

export default LinearProgress
