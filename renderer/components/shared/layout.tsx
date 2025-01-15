import { Layout, Menu, MenuProps } from 'antd'
import Link from 'next/link'
import { SIDE_MENU } from '../../constants'

interface LayoutComponentProps {
  children: React.ReactNode
}

export function LayoutComponent({ children }: LayoutComponentProps) {
  return (
    <Layout>
      <SideMenu.Component />
      <Layout>
        <Layout.Content>{children}</Layout.Content>
      </Layout>
    </Layout>
  )
}

namespace SideMenu {
  const sideMenus: MenuProps['items'] = SIDE_MENU.map((item) => {
    return {
      key: item.key,
      label: <Link href={item.href}>{item.label}</Link>,
    }
  })

  export function Component() {
    return (
      <Layout.Sider theme="light">
        <Menu items={sideMenus} theme="light" mode="inline" />
      </Layout.Sider>
    )
  }
}
