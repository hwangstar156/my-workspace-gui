import { Button, List } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

export function DependenciesViewer() {
  const [projectPaths, setProjectPaths] = useState<string[]>([])

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

    if (!prevProjectPath || prevProjectPath.length === 0) {
      await window.storeAPI.set('projectPath', [projectPath])
    } else {
      window.storeAPI.set('projectPath', [...prevProjectPath, projectPath])
    }

    setProjectPaths((prev) => [...prev, projectPath])
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
          <List.Item style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
            {projectPath}
          </List.Item>
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
