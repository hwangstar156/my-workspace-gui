import { List } from 'antd'
import { DependencyDetailInfo } from './dependency-detail-info'
import { useState } from 'react'
import { UpOutlined, DownOutlined } from '@ant-design/icons'

interface DependencyItemProps {
  name: string
  version: string
}

export function DependencyItem({ name, version }: DependencyItemProps) {
  const [openDetail, setOpenDetail] = useState(false)

  const handleClickListItem = () => {
    setOpenDetail((prev) => !prev)
  }

  return (
    <>
      <List.Item
        style={{ display: 'flex', alignItems: 'center', padding: '20px', cursor: 'pointer' }}
        onClick={handleClickListItem}
      >
        <List.Item.Meta title={name} description={version} />
        {openDetail ? <UpOutlined /> : <DownOutlined />}
      </List.Item>
      {openDetail ? (
        <List.Item style={{ backgroundColor: '#fff' }}>
          <DependencyDetailInfo dependencyName={name} dependencyVersion={version} />
        </List.Item>
      ) : null}
    </>
  )
}
