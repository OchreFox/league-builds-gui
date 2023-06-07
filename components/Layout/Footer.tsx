import { selectPotatoMode } from '@/store/potatoModeSlice'
import { cx } from '@emotion/css'
import { Icon } from '@iconify/react'
import packageJson from 'package.json'
import { useSelector } from 'react-redux'

import styles from './Footer.module.scss'

export default function Footer() {
  const potatoMode = useSelector(selectPotatoMode)

  return (
    <footer
      className={cx(
        'body-font font-display relative mx-auto flex flex-col items-center border-t-2 border-brand-default bg-gray-800/60 px-5 py-6 text-gray-100 print:hidden sm:flex-row sm:py-2',
        !potatoMode && 'backdrop-blur-xl',
        styles.footerTerminal
      )}
    >
      <a
        title="Home"
        href="https://ochrefox.net"
        className="flex shrink-0 items-center justify-center md:justify-start"
      >
        <img className="mx-2 rounded-full" src="/icon.png" alt="OchreFox" width="30" height="30" />
        <img src="/ochrefox-logo-white.svg" alt="Logo" className="mt-1 mr-2" width="90" height="30" />
      </a>
      <div className="mt-4 grid text-left text-sm text-gray-100 sm:ml-4 sm:mt-0 sm:border-l-2 sm:border-gray-700 sm:py-2 sm:pl-4">
        <p className="inline-flex items-center bg-black/25 font-monospace text-green-500">
          {new Date().getFullYear()} - Made with
          <Icon icon="twemoji:red-heart" inline={true} className="mx-2" />
          by OchreFox
        </p>
        <span className="bg-black/25 font-monospace text-xs font-light text-green-300/50">
          <span className={cx('bg-green-300 px-1 font-semibold text-black', styles.footerSectionHeader)}>
            LEGAL DISCLAIMER &gt;&gt;{' '}
          </span>
          &ensp;"League Tools - Item Builds" isn't endorsed by Riot Games and doesn't reflect the views or opinions of
          Riot Games or anyone officially involved in producing or managing League of Legends. League Tools: Item Builds
          was created under Riot Games'{' '}
          <a
            href="https://www.riotgames.com/en/legal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-300"
          >
            "Legal Jibber Jabber" policy
          </a>{' '}
          using assets owned by Riot Games. Riot Games does not endorse or sponsor this project. League of Legends and
          Riot Games are trademarks or registered trademarks of{' '}
          <a href="https://www.riotgames.com/en" target="_blank" rel="noopener noreferrer" className="text-green-300">
            Riot Games, Inc.
          </a>{' '}
          League of Legends © Riot Games, Inc.{' '}
          <p className="text-yellow-300/50">
            <span className={cx('bg-yellow-300 px-1 font-semibold text-black', styles.footerSectionHeader)}>
              COOKIE POLICY &gt;&gt;{' '}
            </span>
            &ensp;This website uses only necessary, functional cookies.{' '}
          </p>
          <p className="text-cyan-300/50">
            <span className={cx('bg-cyan-300 px-1 font-semibold text-black', styles.footerSectionHeader)}>
              ICONS ATTRIBUTION &gt;&gt;{' '}
            </span>
            &ensp;Provided by{' '}
            <a href="https://iconify.design/" target="_blank" rel="noopener noreferrer" className="text-cyan-300">
              Iconify.design
            </a>
            , Designed by{' '}
            <a
              href="https://github.com/tabler/tabler-icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300"
            >
              Tabler Icons
            </a>
            ,{' '}
            <a
              href="https://github.com/twitter/twemoji"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300"
            >
              Twitter Emoji (Twemoji)
            </a>
            ,{' '}
            <a
              href="https://github.com/twbs/bootstrap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300"
            >
              Bootstrap Icons
            </a>{' '}
            under the{' '}
            <a
              href="
                  https://creativecommons.org/licenses/by/4.0/
                "
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300"
            >
              CC BY 4.0 License
            </a>{' '}
            and{' '}
            <a
              href="https://spdx.org/licenses/MIT.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300"
            >
              MIT License
            </a>
            , where applicable.
          </p>
        </span>
      </div>
      <span className="flex shrink-0 flex-col items-center justify-center px-0 sm:ml-auto sm:mt-0 sm:justify-start md:px-6">
        <div className="mt-4 inline-flex flex-row space-x-4">
          <a href="https://www.twitch.tv/ochrefox" className="text-gray-400 hover:text-white" title="Twitch">
            <Icon icon="bi:twitch" width="24" />
          </a>
          <a href="mailto:contact@ochrefox.net" className="text-gray-400 hover:text-white" title="Contact">
            <Icon icon="bi:envelope" width="24" />
          </a>
          <a
            href="https://github.com/OchreFox/league-builds-gui"
            className="text-gray-400 hover:text-white"
            title="GitHub"
          >
            <Icon icon="bi:github" width="24" />
          </a>
        </div>
        <div className="mt-2 flex flex-row">
          <p className="text-center text-xs text-gray-400">v{packageJson.version}</p>
        </div>
      </span>
    </footer>
  )
}
