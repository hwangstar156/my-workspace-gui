import { useEffect, useState } from 'react'
import { NpmrcEditor } from '../components/npmrc/npmrc-editor'
import Link from 'next/link'

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
      <Link href="/nvm">nvm으로 이동</Link>
      {/* <NpmrcEditor type="project" targetPath={projectPath} /> */}
    </>
  )
}
