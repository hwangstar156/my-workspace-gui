import { List } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DependencyItem } from './dependency-item'
import { DependencyHeader } from './header'
import { BackButton } from '../shared/back-button'

export function DependenciesDetailViewer() {
  const [dependencies, setDependencies] = useState<{ name: string; version: string }[]>([])
  const [projectPath, setProjectPath] = useState('')
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

      setProjectPath(currentProjectPath.path)

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
    <>
      <DependencyHeader title={projectPath} left={<BackButton />} />
      <List
        style={{ height: '100vh', overflow: 'auto' }}
        itemLayout="horizontal"
        dataSource={dependencies}
        loading={!dependencies.length}
        renderItem={(projectPath) => (
          <DependencyItem
            key={projectPath.name}
            name={projectPath.name}
            version={projectPath.version}
          />
        )}
      />
    </>
  )
}

// 로딩 처리
// projectlist -> 삭제 가능
// 프로젝트 선택시 중복안되도록, npm repository 아니면 안되도록 처리
