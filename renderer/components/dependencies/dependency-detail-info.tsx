import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Table } from 'antd'

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
  }, [])

  const handleClickLinkToDocs = () => {
    window.projectAPI.linkToDocs(dependencyName)
  }

  if (!currentDependencyInfo || !latestDependencyInfo) {
    return <Container>Loading...</Container>
  }

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Unpacked Size',
      dataIndex: 'unpackedSize',
      key: 'unpackedSize',
    },
  ]

  const dataSource = [
    {
      key: '1',
      type: 'Current',
      description: currentDependencyInfo.version,
      unpackedSize: bytoToKb(currentDependencyInfo.unpackedSize),
    },
    {
      key: '2',
      type: 'Latest',
      description: latestDependencyInfo.version,
      unpackedSize: bytoToKb(latestDependencyInfo.unpackedSize),
    },
  ]

  return (
    <Container>
      <Title>{currentDependencyInfo.name}</Title>
      <Description>{currentDependencyInfo.description}</Description>

      <Table
        columns={columns}
        dataSource={dataSource}
        style={{ marginTop: '15px' }}
        pagination={false}
      />

      <Button
        style={{ width: '80%', margin: '15px auto 0 auto' }}
        variant="filled"
        onClick={handleClickLinkToDocs}
      >
        Link to Docs
      </Button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  width: 100%;
  height: 100%;
  overflow: auto;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
`

const Description = styled.p`
  color: rgba(0, 0, 0, 0.45);
`

const bytoToKb = (bytes: number) => {
  return (bytes / 1024).toFixed(2) + ' KB'
}
