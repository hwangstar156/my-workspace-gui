import { useEffect, useState } from 'react'
import { SwitchCase } from '../shared/switch-case'

export function NvmEditor() {
  const [versions, setVersions] = useState([])

  useEffect(() => {
    async function fetchFilteredVersions() {
      try {
        const homeDir = await window.api.getHomeDir()
        const nvmrcPath = `${homeDir}/.nvmrc`

        const currentVersion = (await window.npmrcAPI.readNpmrc(nvmrcPath)).content.trim() as string
        const remoteVersions = (
          (await window.nvmAPI.command('nvm ls-remote --no-colors')) as string
        )
          .split('\n')
          .map((line) => line.trim().replace(/[\s->]/g, ''))
          .map((line) => line.replace('*', ''))
          .map((line) => line.replace(/.*?(v\d+\.\d+\.\d+).*/, '$1'))
          .filter(Boolean)
          .filter((v) => Number(v.split('v')[1].split('.')[0]) >= 14)

        const installedVersions = ((await window.nvmAPI.command('nvm ls --no-colors')) as string)
          .split('\n')
          .map((line) => line.trim().replace(/[\s->]/g, ''))
          .map((line) => line.replace('*', ''))
          .filter((line: string) => line.startsWith('v'))

        const versions = remoteVersions
          .map((version) => {
            const status = (function () {
              if (version.includes(currentVersion)) {
                return 'current'
              }

              if (installedVersions.includes(version)) {
                return 'installed'
              }

              return 'not-installed'
            })()

            return { version, status }
          })
          .sort((a, b) => {
            const priority = { current: 0, installed: 1, 'not-installed': 2 }

            if (priority[a.status] !== priority[b.status]) {
              return priority[a.status] - priority[b.status]
            }

            const versionToNumber = (version: string) =>
              parseFloat(version.replace('v', '').split('.').join(''))
            return versionToNumber(b.version) - versionToNumber(a.version)
          })

        setVersions(versions)
      } catch (error) {
        console.error('버전 정보를 가져오지 못했습니다.', error)
      }
    }

    fetchFilteredVersions()
  }, [])

  const handleVersionSelect = async (version: string, status: 'installed' | 'not-installed') => {
    const homeDir = await window.api.getHomeDir()
    const nvmrcFilePath = `${homeDir}/.nvmrc`

    await window.npmrcAPI.writeNpmrc(nvmrcFilePath, version)

    await window.nvmAPI.setNodeVersion(version, status === 'installed')

    await window.terminalAPI.openTerminal(`source ~/.bashrc`)
    alert(`${version} 버전이 활성화되었습니다. 변경된 버전은 새로운 터미널에서 확인할 수 있습니다.`)
    window.location.reload()
  }

  return (
    <div>
      <ul>
        {versions.map(({ version, status }) => (
          <li key={version} onClick={() => handleVersionSelect(version, status)}>
            {version}
            <SwitchCase
              value={status}
              caseBy={{
                installed: <span style={{ color: 'green' }}> (installed)</span>,
                current: <span style={{ color: 'blue' }}> (current)</span>,
                'not-installed': <span style={{ color: 'red' }}> (not installed)</span>,
              }}
              defaultComponent={null}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
