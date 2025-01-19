import { RightOutlined } from '@ant-design/icons'
import { Button, List } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

export function DependenciesViewer() {
  const [projectPaths, setProjectPaths] = useState<{ id: string; path: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchProjectPaths = async () => {
      const projectPaths = await window.storeAPI.get('projectPath')
      setProjectPaths(projectPaths || [])
    }

    fetchProjectPaths()
  }, [])

  const handleAddProject = async () => {
    const projectPath = await window.projectAPI.getProject()

    const prevProjectPath = await window.storeAPI.get('projectPath')

    if (!projectPath) {
      return
    }

    const newItem = { id: uuidv4(), path: projectPath }

    if (!prevProjectPath || prevProjectPath.length === 0) {
      await window.storeAPI.set('projectPath', [newItem])
    } else {
      window.storeAPI.set('projectPath', [...prevProjectPath, newItem])
    }

    setProjectPaths((prev) => [...prev, newItem])
  }

  const handleClickListItem = (dependencyId: string) => {
    router.push(`/dependencies/${dependencyId}`)
  }

  return (
    <>
      <Container>
        <Text>Project List</Text>
        <Button onClick={handleAddProject} style={{ marginLeft: 'auto' }}>
          Add Project Path
        </Button>
      </Container>
      <List
        style={{ height: '100vh', overflow: 'auto' }}
        itemLayout="horizontal"
        dataSource={projectPaths}
        renderItem={(projectPath) => (
          <StyledListItem onClick={() => handleClickListItem(projectPath.id)}>
            {projectPath.path}
            <RightOutlined />
          </StyledListItem>
        )}
      />
    </>
  )
}

const Text = styled.h1`
  font-size: 14px;
  font-weight: 700;
`

const Container = styled.div`
  display: flex;
  padding: 15px;
  background-color: #fff;
  align-items: center;
`

const StyledListItem = styled(List.Item)`
  display: flex !important;
  align-items: center !important;
  padding: 20px !important;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
    color: #1890ff;
  }
`
