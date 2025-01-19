import { List } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DependencyItem } from './dependency-item'

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

      const { data, currentHash } = await window.cacheAPI.getDependencies(currentProjectPath.path)

      if (data) {
        setDependencies(data)
        return
      }

      const newDependencies = await window.projectAPI.getDependencies(currentProjectPath.path)

      await window.cacheAPI.setDependencies(currentProjectPath.path, newDependencies, currentHash)

      setDependencies(newDependencies)
    }

    fetchAndSetDependencies()
  }, [])

  return (
    <List
      style={{ height: '100vh', overflow: 'auto' }}
      itemLayout="horizontal"
      dataSource={dependencies}
      renderItem={(projectPath) => (
        <DependencyItem
          key={projectPath.name}
          name={projectPath.name}
          version={projectPath.version}
        />
      )}
    />
  )
}

const getCachedData = () => {}
