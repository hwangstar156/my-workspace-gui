import { List } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DependencyDetailInfo } from './dependency-detail-info'

export function DependenciesDetailViewer() {
  const [dependencies, setDependencies] = useState<{ name: string; version: string }[]>([])
  const router = useRouter()
  const id = router.query.id

  useEffect(() => {
    const fetchAndSetDependencies = async () => {
      const projectPaths: {
        id: string
        path: string
      }[] = await window.storeAPI.get('projectPath')

      const currentProjectPath = projectPaths.find((projectPath) => projectPath.id === id)

      if (!currentProjectPath) {
        return
      }

      const dependencies = await window.projectAPI.getDependencies(currentProjectPath.path)

      setDependencies(dependencies)
    }

    fetchAndSetDependencies()
  }, [])

  return (
    <List
      style={{ height: '100vh', overflow: 'auto' }}
      itemLayout="horizontal"
      dataSource={dependencies}
      renderItem={(projectPath, idx) => (
        <>
          <List.Item style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
            <List.Item.Meta title={projectPath.name} description={projectPath.version} />
          </List.Item>
          <List.Item style={{ backgroundColor: '#fff' }}>
            <DependencyDetailInfo
              dependencyName={projectPath.name}
              dependencyVersion={projectPath.version}
            />
          </List.Item>
        </>
      )}
    />
  )
}
