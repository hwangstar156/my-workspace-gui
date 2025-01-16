import { useEffect, useState } from 'react'
import { SwitchCase } from '../shared/switch-case'
import { List, Avatar, Button } from 'antd'

type Version = {
  version: string
  status: 'installed' | 'not-installed' | 'current'
}

export function NvmEditor() {
  const [versions, setVersions] = useState<Version[]>([])

  useEffect(() => {
    async function fetchFilteredVersions() {
      try {
        const homeDir = await window.api.getHomeDir()
        const nvmrcPath = `${homeDir}/.nvmrc`

        const [currentVersion, remoteVersions, installedVersions] = await Promise.all([
          window.npmrcAPI.readNpmrc(nvmrcPath),
          window.nvmAPI.command('nvm ls-remote --no-colors'),
          window.nvmAPI.command('nvm ls --no-colors'),
        ])

        const parsedCurrentVersion = currentVersion.content.trim() as string
        const parsedRemoteVersions = (remoteVersions as string)
          .split('\n')
          .map((line) => line.trim().replace(/[\s->]/g, ''))
          .map((line) => line.replace('*', ''))
          .map((line) => line.replace(/.*?(v\d+\.\d+\.\d+).*/, '$1'))
          .filter(Boolean)
          .filter((v) => Number(v.split('v')[1].split('.')[0]) >= 14)

        const parsedInstalledVersions = (installedVersions as string)
          .split('\n')
          .map((line) => line.trim().replace(/[\s->]/g, ''))
          .map((line) => line.replace('*', ''))
          .filter((line: string) => line.startsWith('v'))

        const versions = parsedRemoteVersions
          .map((version) => {
            const status = (function () {
              if (version.includes(parsedCurrentVersion)) {
                return 'current'
              }

              if (parsedInstalledVersions.includes(version)) {
                return 'installed'
              }

              return 'not-installed'
            })()

            return { version, status } as const
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

  const handleVersionSelect = async ({ status, version }: Version) => {
    const homeDir = await window.api.getHomeDir()
    const nvmrcFilePath = `${homeDir}/.nvmrc`

    await window.npmrcAPI.writeNpmrc(nvmrcFilePath, version)

    await window.nvmAPI.setNodeVersion(version, status === 'installed')

    await window.terminalAPI.openTerminal(`source ~/.bashrc`)
    alert(`${version} 버전이 활성화되었습니다. 변경된 버전은 새로운 터미널에서 확인할 수 있습니다.`)
    window.location.reload()
  }

  return (
    <List
      style={{ height: '100%', overflow: 'auto' }}
      itemLayout="horizontal"
      dataSource={versions}
      renderItem={(item, index) => (
        <List.Item style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
          <List.Item.Meta
            avatar={<Avatar src={`/images/nodejs.png`} />}
            title={item.version}
            description={
              <SwitchCase
                value={item.status}
                caseBy={{
                  installed: <span style={{ color: '#78C257' }}>installed</span>,
                  current: <span style={{ color: '#1DA1F2' }}>current</span>,
                  'not-installed': <span style={{ color: '#FF5A5F' }}>not installed</span>,
                }}
                defaultComponent={null}
              />
            }
          />
          <SwitchCase
            value={item.status}
            caseBy={{
              installed: (
                <Button
                  variant="outlined"
                  color="green"
                  onClick={() => handleVersionSelect({ ...item })}
                >
                  적용하기
                </Button>
              ),
              current: <Button disabled>현재버전</Button>,
              'not-installed': (
                <Button
                  variant="outlined"
                  color="red"
                  onClick={() => handleVersionSelect({ ...item })}
                >
                  설치 후 적용하기
                </Button>
              ),
            }}
            defaultComponent={null}
          />
        </List.Item>
      )}
    />
  )
}
