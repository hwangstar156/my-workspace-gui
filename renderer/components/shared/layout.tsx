import { Layout, Menu, MenuProps } from 'antd'
import Link from 'next/link'
import { SIDE_MENU } from '../../constants'
import { useRouter } from 'next/router'

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
    const router = useRouter()
    const pathname = router.pathname.split('/')[1]

    return (
      <Layout.Sider theme="light">
        <Menu items={sideMenus} theme="light" mode="inline" defaultSelectedKeys={[pathname]} />
      </Layout.Sider>
    )
  }
}
