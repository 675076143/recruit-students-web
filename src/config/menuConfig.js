/*
* 菜单栏配置选项
* 根据此配置动态生成左侧菜单栏
* 使用map(menuConfig)
* 存在两种情况：
*   1.无子节点(<Menu.Item/>)
*   2.有子节点(<SubMenu><Menu.Item/></SubMenu>)
* 例：
* <Menu.Item key="/admin/home">
        <Link to='/admin/home'>
            <Icon type="pie-chart" />
            <span>首页</span>
        </Link>
   </Menu.Item>
*  <SubMenu
        key="sub1"
        title={
            <span>
                <Icon type="mail" />
                <span>图表</span>
            </span>
        }
    >
        <Menu.Item key="5">
            <Link to='/admin/home'>
                <Icon type="pie-chart" />
                <span>饼图</span>
            </Link>
        </Menu.Item>
    </SubMenu>
* */

const menuConfig = [
    {
        key:'/',
        icon:'ios-home',
        title:'首页',
        isPublic:true
    },
    {
        key:'/user',
        icon:'ios-contact',
        title:'用户管理'
    },
    {
        key:'/role',
        icon:'ios-contact',
        title:'角色管理'

    },
    {
        key:'/data',
        icon:'ios-paper',
        title:'数据录入'

    },
    {
        key:'/recruit',
        icon:'ios-star',
        title:'录取',
        children:[
            {
                key:'/topBatch',
                icon:'ios-star-half',
                title:'一批'
            },
            {
                key:'/subBatch',
                icon:'ios-star-outline',
                title:'二批'
            }
        ]
    },
    {
        key:'/query',
        icon:'ios-search',
        title:'查询',
        children:[
            {
                key:'/score',
                icon:'ios-document',
                title:'学生成绩'
            },
            {
                key:'/info',
                icon:'ios-document',
                title:'学生信息'
            },
            {
                key:'/regExam',
                icon:'ios-document',
                title:'报考信息'
            },
            {
                key:'/plan',
                icon:'ios-document',
                title:'招生计划'
            }
        ]
    },
]

export default menuConfig