import Image from 'next/image'

import { cx } from '@emotion/css'
import { Icon } from '@iconify/react'
import packageJson from 'package.json'
import logoIcon from 'public/icon.png'
import Logo from 'public/ochrefox-logo-white.svg'
import { useSelector } from 'react-redux'

import { selectPotatoMode } from '@/store/potatoModeSlice'

const FooterSection = ({
  title,
  className,
  children,
  ...rest
}: {
  title: string
  className?: string
  children: React.ReactNode
  rest?: any
}) => (
  <p className={className} {...rest}>
    <span className={cx('px-1 font-bold text-yellow-100')}>{title}:</span>
    &ensp;
    {children}
  </p>
)

export default function Footer() {
  const potatoMode = useSelector(selectPotatoMode)

  return (
    <footer
      className={cx(
        'relative mx-auto flex flex-col items-center border-t-2 border-brand-default bg-gray-800/60 px-5 py-6 text-gray-100 print:hidden sm:flex-row sm:py-2',
        !potatoMode && 'backdrop-blur-xl'
      )}
    >
      <a
        title="Home"
        href="https://ochrefox.net"
        className="flex shrink-0 items-center justify-center md:justify-start"
      >
        <Image className="mx-2 rounded-full" src={logoIcon} alt="OchreFox" width={30} height={30} />
        <Logo alt="Logo" className="mr-2 mt-1 h-full w-24" />
      </a>

      <div className="mt-4 grid bg-black/25 px-2 py-1 text-left font-league text-sm text-gray-100 sm:ml-4 sm:mt-0">
        <p className="inline-flex items-center text-green-500">
          {new Date().getFullYear()} - Made with
          <Icon icon="twemoji:red-heart" inline={true} className="mx-2" />
          by OchreFox
        </p>
        <span className="text-sm font-light text-green-300/50">
          <FooterSection title="DISCLAIMER">
            &quot;League Tools - Item Builds&quot; isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views
            or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League
            Tools: Item Builds was created under Riot Games&apos;{' '}
            <a
              href="https://www.riotgames.com/en/legal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300"
            >
              &quot;Legal Jibber Jabber&quot; policy
            </a>{' '}
            using assets owned by Riot Games. Riot Games does not endorse or sponsor this project. League of Legends and
            Riot Games are trademarks or registered trademarks of{' '}
            <a href="https://www.riotgames.com/en" target="_blank" rel="noopener noreferrer" className="text-green-300">
              Riot Games, Inc.
            </a>{' '}
            League of Legends © Riot Games, Inc.{' '}
          </FooterSection>
          <FooterSection title="COOKIE POLICY" className="text-yellow-300/50">
            This website uses only necessary, functional cookies.{' '}
          </FooterSection>
          <FooterSection title="ICONS ATTRIBUTION" className="text-cyan-300/50">
            Provided by{' '}
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
          </FooterSection>
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
