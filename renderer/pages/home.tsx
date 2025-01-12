import { useEffect, useState } from 'react'

export default function HomePage() {
  const [globalNpmrc, setGlobalNpmrc] = useState<string[]>([])
  const [projectNpmrc, setProjectNpmrc] = useState<string[]>([])

  useEffect(() => {
    const getNpmrc = async () => {
      const homeDir = await window.api.getHomeDir()

      const globalResult = await window.npmrcAPI.readNpmrc(`${homeDir}/.npmrc`)
      const projectResult = await window.npmrcAPI.readNpmrc(`./.npmrc`)

      const globalContent = globalResult.content.split('\n')
      const projectContent = projectResult.content.split('\n')

      setGlobalNpmrc(globalContent)
      setProjectNpmrc(projectContent)
    }

    getNpmrc()
  }, [])

  return (
    <>
      <div>global npmrc</div>
      {globalNpmrc.map((npmrc) => (
        <div>{npmrc}</div>
      ))}
      <div>local npmrc</div>
      {projectNpmrc.map((npmrc) => (
        <div>{npmrc}</div>
      ))}
    </>
  )
}
