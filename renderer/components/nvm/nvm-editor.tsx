import { useEffect, useState } from 'react'

export function NvmEditor() {
  const [versions, setVersions] = useState([])

  useEffect(() => {
    async function fetchFilteredVersions() {
      try {
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
            const status = installedVersions.includes(version) ? 'installed' : 'not-installed'
            return { version, status }
          })
          .sort((a, b) => {
            if (a.status === 'installed' && b.status !== 'installed') {
              return -1
            }

            if (a.status !== 'installed' && b.status === 'installed') {
              return 1
            }

            const versionToNumber = (version: string) =>
              parseFloat(version.replace('v', '').split('.').join(''))
            return versionToNumber(b.version) - versionToNumber(a.version)
          })

        console.log(versions)
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

    if (status === 'installed') {
      await window.terminalAPI.openTerminal(`nvm use`)
    } else {
      await window.terminalAPI.openTerminal(`nvm install ${version} && nvm use`)
    }

    alert(`${version} 버전이 활성화되었습니다.`)
  }

  return (
    <div>
      <h1>Node.js Version Manager (14 이상)</h1>
      <ul>
        {versions.map(({ version, status }) => (
          <li key={version} onClick={() => handleVersionSelect(version, status)}>
            {version} ({status === 'installed' ? '사용하기' : '설치 후 사용하기'})
          </li>
        ))}
      </ul>
    </div>
  )
}
