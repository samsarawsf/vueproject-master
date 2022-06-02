/**
* 左边菜单
*/
<template>
  <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="">
    </div>
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname+''">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{menu.menuName}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{chmenu.menuName}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
import {menu, MenuTree, myMenuTree} from '../api/userMG'
export default {
  name: 'leftnav',
  data() {
    return {
      collapsed: false,
      allmenu: [],
      user: {},
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    // 获取图形验证码
    // let res = {
    //   success: true,
    //   data: [
    //     {
    //       menuid: 1,
    //       icon: 'icon-cs-manage',
    //       menuName: '公司管理',
    //       hasThird: null,
    //       url: null,
    //       menus: [
    //         {
    //           menuid: 2,
    //           icon: 'icon-cat-skuQuery',
    //           menuName: '部门管理',
    //           hasThird: 'N',
    //           url: 'company/Dept',
    //           menus: null
    //         },{
    //           menuid: 3,
    //           icon: 'icon-cus-manage',
    //           menuName: '员工管理',
    //           hasThird: 'N',
    //           url: 'company/Employee',
    //           menus: null
    //         }
    //         ,{
    //           menuid: 4,
    //           icon: 'li-icon-dingdanguanli',
    //           menuName: '职位管理',
    //           hasThird: 'N',
    //           url: 'company/Job',
    //           menus: null
    //         }
    //       ]
    //     },
    //     {
    //       menuid: 33,
    //       icon: 'li-icon-dingdanguanli',
    //       menuName: '订单管理',
    //       hasThird: null,
    //       url: null,
    //       menus: [
    //         {
    //           menuid: 34,
    //           icon: 'icon-order-manage',
    //           menuName: '交易订单',
    //           hasThird: 'N',
    //           url: 'pay/Order',
    //           menus: null
    //         }
    //       ]
    //     },
    //     {
    //       menuid: 71,
    //       icon: 'li-icon-xitongguanli',
    //       menuName: '系统管理',
    //       hasThird: null,
    //       url: null,
    //       menus: [
    //         {
    //           menuid: 72,
    //           icon: 'icon-cus-manage',
    //           menuName: '用户管理',
    //           hasThird: 'N',
    //           url: 'system/user',
    //           menus: null
    //         },
    //         {
    //           menuid: 174,
    //           icon: 'icon-cms-manage',
    //           menuName: '菜单管理',
    //           hasThird: 'N',
    //           url: 'system/Module',
    //           menus: null
    //         },
    //         {
    //           menuid: 73,
    //           icon: 'icon-news-manage',
    //           menuName: '角色管理',
    //           hasThird: 'N',
    //           url: 'system/Role',
    //           menus: null
    //         },
    //         {
    //           menuid: 74,
    //           icon: 'icon-cs-manage',
    //           menuName: '公司管理',
    //           hasThird: 'N',
    //           url: 'system/Dept',
    //           menus: null
    //         },
    //         {
    //           menuid: 75,
    //           icon: 'icon-promotion-manage',
    //           menuName: '系统环境变量',
    //           hasThird: 'N',
    //           url: 'system/Variable',
    //           menus: null
    //         },
    //         {
    //           menuid: 76,
    //           icon: 'icon-cms-manage',
    //           menuName: '权限管理',
    //           hasThird: 'N',
    //           url: 'system/Permission',
    //           menus: null
    //         }
    //       ]
    //     },
    //     {
    //       menuid: 128,
    //       icon: 'li-icon-shangchengxitongtubiaozitihuayuanwenjian91',
    //       menuName: '支付管理',
    //       hasThird: null,
    //       url: null,
    //       menus: [
    //         {
    //           menuid: 129,
    //           icon: 'icon-provider-manage',
    //           menuName: '支付配置信息',
    //           hasThird: 'N',
    //           url: 'machine/MachineConfig',
    //           menus: null
    //         },
    //         {
    //           menuid: 175,
    //           icon: 'icon-provider-manage',
    //           menuName: '支付配置',
    //           hasThird: 'N',
    //           url: 'pay/Config',
    //           menus: null
    //         }
    //       ]
    //     },
    //     // {
    //     //   menuid: 150,
    //     //   icon: 'li-icon-shangchengxitongtubiaozitihuayuanwenjian91',
    //     //   menuname: '图表',
    //     //   hasThird: null,
    //     //   url: null,
    //     //   menus: [
    //     //     {
    //     //       menuid: 159,
    //     //       icon: 'icon-provider-manage',
    //     //       menuname: '数据可视化',
    //     //       hasThird: 'N',
    //     //       url: 'charts/statistics',
    //     //       menus: null
    //     //     }
    //     //   ]
    //     // }
    //   ],
    //   msg: 'success'
    // }
    //       this.allmenu = res.data
    this.user = JSON.parse(localStorage.getItem('userdata'))
    // menu(localStorage.getItem('logintoken'))
    //   .then(res => {
    //     console.log(JSON.stringify(res))
    //     if (res.success) {
    //       this.allmenu = res.data
    //     } else {
    //       this.$message.error(res.msg)
    //       return false
    //     }
    //   })
    //   .catch(err => {
    //     this.$message.error('菜单加载失败，请稍后再试！')
    //   })
    let parm={
      id:this.user.data.id
    }
    myMenuTree(parm)
      .then(
        res =>{
          this.loading = false
          if (res.status !==  200) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }else {
            this.allmenu = res.data
          }}
      )
      .catch(err => {
        this.loading = false
        this.$message.error('获取权限列表失败，请稍后再试！')
      })
    // 监听
    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.el-menu {
  border: none;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
</style>
