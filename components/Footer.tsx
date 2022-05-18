import Image from 'next/image'
import { Icon } from '@iconify/react'
import packageJson from '../package.json'
import logo from '../public/logo-white.svg'
import headIcon from '../public/icon.png'

export default function Footer() {
  return (
    <footer className="body-font font-display relative border-t-2 border-brand-default bg-gray-800/60 text-gray-100 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex flex-col items-center px-5 py-6 sm:flex-row sm:py-2">
        <a
          title="Home"
          href="https://ochrefox.net"
          className="flex items-center justify-center md:justify-start"
        >
          <Image className="mx-2 rounded-full" src={headIcon} alt="Logo" />
          <Image
            src={logo}
            alt="Logo"
            className="mt-1 mr-2"
            width={200}
            height={30}
          />
        </a>
        <div className="mt-4 grid text-center text-sm text-gray-100 sm:ml-4 sm:mt-0 sm:border-l-2 sm:border-gray-700 sm:py-2 sm:pl-4 sm:text-left">
          <p className="inline-flex items-center bg-black/25 font-monospace text-green-500">
            {new Date().getFullYear()} - Made with &nbsp;
            <Icon icon="twemoji:red-heart" inline={true} />
            &nbsp; by OchreFox
          </p>
          <p className="bg-black/25 font-monospace text-xs font-light text-green-300/50">
            Legal Disclaimer &gt;&gt; League Builds GUI isn't endorsed by Riot
            Games and doesn't reflect the views or opinions of Riot Games or
            anyone officially involved in producing or managing League of
            Legends. League Builds GUI was created under Riot Games' "Legal
            Jibber Jabber" policy using assets owned by Riot Games. Riot Games
            does not endorse or sponsor this project. League of Legends and Riot
            Games are trademarks or registered trademarks of{' '}
            <a
              href="https://www.riotgames.com/en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300"
            >
              Riot Games, Inc.
            </a>{' '}
            League of Legends © Riot Games, Inc.{' '}
            <a
              href="https://iconify.design/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300"
            >
              &gt;&gt; Icons provided by Iconify.design (Bootstrap Icons)
            </a>
          </p>
        </div>
        <span className="flex flex-col items-center justify-center px-0 sm:ml-auto sm:mt-0 sm:justify-start md:px-6">
          <div className="mt-4 inline-flex flex-row space-x-4">
            <a
              href="https://www.twitch.tv/ochrefox"
              className="text-gray-400"
              title="Twitch"
            >
              <Icon icon="bi:twitch" width="24" />
            </a>
            <a
              href="mailto:contact@ochrefox.net"
              className="text-gray-400"
              title="Contact"
            >
              <Icon icon="bi:envelope" width="24" />
            </a>
          </div>
          <div className="mt-2 flex flex-row">
            <p className="text-xs text-gray-400">v{packageJson.version}</p>
          </div>
        </span>
      </div>
    </footer>
  )
}
