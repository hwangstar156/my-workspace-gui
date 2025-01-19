import { RightOutlined } from '@ant-design/icons'
import { Button, Checkbox, CheckboxChangeEvent, List } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { DependencyHeader } from './header'

export function DependenciesViewer() {
  const [projectPaths, setProjectPaths] = useState<{ id: string; path: string }[]>([])
  const [checkedIdList, setCheckedIdList] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchProjectPaths = async () => {
      const projectPaths = await window.storeAPI.get('projectPath')
      setProjectPaths(projectPaths || [])
    }

    fetchProjectPaths()
  }, [])

  const handleAddProject = async () => {
    try {
      const projectPath = await window.projectAPI.getProject()

      if (projectPath.error) {
        throw new Error(projectPath.error)
      }

      const prevProjectPath = await window.storeAPI.get('projectPath')

      if (!projectPath.path) {
        return
      }

      const newItem = { id: uuidv4(), path: projectPath.path }

      if (!prevProjectPath || prevProjectPath.length === 0) {
        await window.storeAPI.set('projectPath', [newItem])
      } else {
        window.storeAPI.set('projectPath', [...prevProjectPath, newItem])
      }

      setProjectPaths((prev) => [...prev, newItem])
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteProject = async () => {
    const newProjectPaths = projectPaths.filter(
      (projectPath) => !checkedIdList.includes(projectPath.id)
    )

    await window.storeAPI.set('projectPath', newProjectPaths)

    setProjectPaths(newProjectPaths)
    setCheckedIdList([])
  }

  const handleChangeCheckBox = (e: CheckboxChangeEvent, checkedid: string) => {
    const { checked } = e.target

    if (checked) {
      setCheckedIdList((prev) => [...prev, checkedid])
      return
    }

    setCheckedIdList((prev) => prev.filter((id) => id !== checkedid))
  }

  const handleClickListItem = (dependencyId: string) => {
    router.push(`/dependencies/${dependencyId}`, undefined, { shallow: true })
  }

  return (
    <>
      <DependencyHeader
        title="Project List"
        right={
          <>
            <Button type="primary" onClick={handleAddProject} style={{ marginLeft: 'auto' }}>
              Add Project
            </Button>
            <Button
              onClick={handleDeleteProject}
              type="primary"
              danger
              style={{ marginLeft: '10px' }}
            >
              Delete Project
            </Button>
          </>
        }
      ></DependencyHeader>
      <List
        style={{ height: '100vh', overflow: 'auto' }}
        itemLayout="horizontal"
        dataSource={projectPaths}
        renderItem={(projectPath) => (
          <StyledListItem>
            <Checkbox onChange={(e) => handleChangeCheckBox(e, projectPath.id)}>
              {projectPath.path}
            </Checkbox>
            <RightOutlined onClick={() => handleClickListItem(projectPath.id)} />
          </StyledListItem>
        )}
      />
    </>
  )
}

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
