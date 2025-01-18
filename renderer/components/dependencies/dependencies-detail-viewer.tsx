import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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
    <div>
      {dependencies.map((dependency) => (
        <div key={dependency.name}>
          <span>{dependency.name}</span>
          <span>{dependency.version}</span>
        </div>
      ))}
    </div>
  )
}
