import { useEffect, useState } from 'react'

interface DependencyDetailInfoProps {
  dependencyName: string
  dependencyVersion: string
}

interface DependencyInfo {
  name: string
  version: string
  description: string
  unpackedSize: number
}

export function DependencyDetailInfo({
  dependencyName,
  dependencyVersion,
}: DependencyDetailInfoProps) {
  const [currentDependencyInfo, setCurrentDependencyInfo] = useState<DependencyInfo | null>(null)
  const [latestDependencyInfo, setLatestDependencyInfo] = useState<DependencyInfo | null>(null)

  useEffect(() => {
    async function fetchCurrentDependencyInfo() {
      const dependency = await window.projectAPI.getPackageInfo(
        `${dependencyName}@${dependencyVersion}`
      )

      setCurrentDependencyInfo({
        name: dependency.name,
        version: dependency.version,
        description: dependency.description,
        unpackedSize: dependency['dist.unpackedSize'],
      })
    }

    async function fetchLatestDependencyInfo() {
      const latestDependency = await window.projectAPI.getPackageInfo(dependencyName)

      setLatestDependencyInfo({
        name: latestDependency.name,
        version: latestDependency.version,
        description: latestDependency.description,
        unpackedSize: latestDependency['dist.unpackedSize'],
      })
    }

    fetchCurrentDependencyInfo()
    fetchLatestDependencyInfo()

    // name, version으로 조회
    // description
    // 제일 최신버전, 제일 최신버전의 unpackedSize
    // 간단 한줄 설명 -> description
    // dist.unpackedSize
    // npm docs로 보여주기
  })

  if (!currentDependencyInfo || !latestDependencyInfo) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{currentDependencyInfo.name}</h1>
      <h2>{currentDependencyInfo.version}</h2>
      <p>{currentDependencyInfo.description}</p>
      <p>{currentDependencyInfo.unpackedSize}</p>

      <h2>Latest</h2>

      <h1>{latestDependencyInfo.name}</h1>
      <h2>{latestDependencyInfo.version}</h2>
      <p>{latestDependencyInfo.description}</p>
      <p>{latestDependencyInfo.unpackedSize}</p>
    </div>
  )
}
