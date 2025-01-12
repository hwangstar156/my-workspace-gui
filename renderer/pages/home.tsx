import { useEffect, useState } from 'react'
import { NpmrcEditor } from '../components/npmrc/npmrc-editor'

export default function HomePage() {
  const [globalPath, setGlobalPath] = useState<string | undefined>()
  // const [projectPath, setProjectPath] = useState<string | undefined>()

  useEffect(() => {
    const fetchAndSetPath = async () => {
      const homeDir = await window.api.getHomeDir()
      const globalLocalPath = `${homeDir}/.npmrc`
      // const projectLocalPath = `./.npmrc`

      setGlobalPath(globalLocalPath)
      // setProjectPath(projectLocalPath)
    }

    fetchAndSetPath()
  }, [])

  return (
    <>
      <NpmrcEditor type="global" targetPath={globalPath} />
      {/* <NpmrcEditor type="project" targetPath={projectPath} /> */}
    </>
  )
}
