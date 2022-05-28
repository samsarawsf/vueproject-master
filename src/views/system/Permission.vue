/**
 * 系统管理  权限管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
<!--      <el-form-item label="搜索：">-->
<!--        <el-input size="small" v-model="formInline.menuName" placeholder="输入权限名称"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="">-->
<!--        <el-input size="small" v-model="formInline.perms" placeholder="输入权限CODE"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="角色：">-->
<!--        <el-select size="small" v-model="formInline.roleId" placeholder="请选择">-->
<!--          <el-option selected label="请选择" value="0"></el-option>-->
<!--          <el-option v-for="parm in userparm" :key="parm.roleId" :label="parm.roleName" :value="parm.roleId"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item>
<!--        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>-->
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
<!--        <el-button size="small" type="primary" icon="el-icon-plus" @click="RolePermission()">配置权限</el-button>-->
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange"
              :data="listData"
              row-key="id"
              default-expand-all
              :tree-props="{children: 'menus'}"
              highlight-current-row v-loading="loading"
              border element-loading-text="拼命加载中"
              style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
<!--      <el-table-column sortable prop="id" label="编号" width="120">-->
<!--      </el-table-column>-->
      <el-table-column sortable prop="menuName" label="权限名称" width="200">
      </el-table-column>
      <el-table-column sortable prop="perms" label="权限CODE" width="200">
      </el-table-column>
      <el-table-column sortable prop="icon" label="图标" width="200">
      </el-table-column>
      <el-table-column sortable prop="url" label="路径" width="200">
      </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间" width="200">
        <template slot-scope="scope">
          <div>{{scope.row.createTime|timestampToTime}}</div>
        </template>
      </el-table-column>
<!--      <el-table-column sortable prop="editUser" label="修改人" width="300">-->
<!--      </el-table-column>-->
      <el-table-column align="center" sortable prop="status" label="状态" min-width="50">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status==='0'?nshow:fshow" active-color="#13ce66" inactive-color="#ff4949"
                     @change="editType(scope.$index, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
<!--    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>-->
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="上级菜单" prop="parentId" label-width="100px">
          <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
            <template v-for="item in listData">
              <el-option :label="item.menuName" :value="item.id"></el-option>
              <template v-for="child in item.menus">
                <el-option :label="child.menuName" :value="child.id">
                  <span>{{ '- ' + child.menuName }}</span>
                </el-option>
              </template>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="权限编号">
          <el-input size="small" v-model="editForm.id" auto-complete="off" placeholder="权限编号" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限名称" prop="menuName">
          <el-input size="small" v-model="editForm.menuName" auto-complete="off" placeholder="权限名称"></el-input>
        </el-form-item>
        <el-form-item label="权限CODE" prop="perms">
          <el-input size="small" v-model="editForm.perms" auto-complete="off" placeholder="权限CODE"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input size="small" v-model="editForm.icon" auto-complete="off" placeholder="图标"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="icon">
          <el-input size="small" v-model="editForm.url" auto-complete="off" placeholder="路径"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  permissionList,
  ermissionSave,
  ermissionDelete,
  roleDropDown,
  RolePermission,
  menuStatus, MenuTree
} from '../../api/userMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        id: '',
        menuName: '',
        perms: '',
        parentId: '',
        icon: '',
        url: '',
        // token: localStorage.getItem('logintoken')
      },
      // rules表单验证
      rules: {
        menuName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        perms: [
          { required: true, message: '请输入权限CODE', trigger: 'blur' }
        ]
      },
      formInline: {
        page: 1,
        limit: 10,
        menuName: '',
        perms: '',
        roleId: '0',
        // token: localStorage.getItem('logintoken')
      },
      // 选择数据
      selectdata: [],
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  watch: {},

  /**
   * 创建完毕
   */

  created() {
    this.getdata(this.formInline)
    this.getAccsee()
  },

  /**
   * 里面的方法只有被调用才会执行
   */

  methods: {
    // 获取数据方法
    getdata(parameter) {
      this.loading = true

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      // 获取权限列表
      // permissionList(parameter)
      //   .then(res => {
      //     this.loading = false
      //     if (res.status === 500) {
      //       this.$message({
      //         type: 'warning',
      //         message: res.msg
      //       })
      //     } else {
      //       this.listData = res.data.records
      //       // 分页赋值
      //       this.pageparm.currentPage = this.formInline.page
      //       this.pageparm.pageSize = this.formInline.limit
      //       this.pageparm.total = res.data.total
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err)
      //     this.loading = false
      //     this.$message.error('权限管理列表获取失败，请稍后再试！')
      //   })
      MenuTree()
        .then(
          res =>{
            this.loading = false
            if (res.status !==  200) {
              this.$message({
                type: 'info',
                message: res.msg
              })
            }else {
              this.listData = res.data
            }}
        )
        .catch(err => {
          this.loading = false
          this.$message.error('获取权限列表失败，请稍后再试！')
        })
    },
    // 获取权限
    getAccsee() {
      roleDropDown()
        .then(res => {
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.userparm = res.data
          }
        })
        .catch(err => {
          this.$message.error('权限获取失败，请稍后再试！')
        })
    },
    // 修改type
    editType: function (index, row) {
      this.loading = true
      let parm = {
        id: '',
        status: '',
      }
      parm.id = row.id
      let status = row.status
      if (status === '0') {
        parm.status = '1'
      } else {
        parm.status = '0'
      }
      // 修改状态
      menuStatus(parm).then(res => {
        this.loading = false
        if (res.status === 500) {
          this.$message({
            type: 'error',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getdata(this.formInline)
        }
      })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      // 深拷贝并赋值
      //this.editForm = Object.assign({}, row)
      // console.log(row.id)
      if (row !== undefined && row !== 'undefined') {
        this.title = '修改'
        this.editForm.id = row.id
        this.editForm.menuName = row.menuName
        this.editForm.perms = row.perms
        this.editForm.icon = row.icon
        this.editForm.url = row.url
      } else {
        this.title = '添加'
        this.editForm.id = ''
        this.editForm.menuName = ''
        this.editForm.perms = ''
        this.editForm.icon = ''
        this.editForm.url = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          ermissionSave(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.status === 200) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: res.msg
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('权限管理保存失败，请稍后再试！')
            })
        } else {
          return false
        }
      })
    },
    // 删除权限
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let parm = {
            id: row.id,
          }
          ermissionDelete(parm)
            .then(res => {
              if (res.status ===200) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('权限管理删除失败,请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 选择复选框事件
    selectChange(val) {
      this.selectdata = val
    },
    // 配置权限
    RolePermission() {
      let parms = {
        roleId: '',
        permissionIds: ''
      }
      if (this.formInline.roleId === '0') {
        this.$message({
          type: 'info',
          message: '请选择角色'
        })
        return false
      }
      parms.roleId = this.formInline.roleId
      let len = this.selectdata
      let ids = []
      if (len != 0) {
        for (let i = 0; i < len.length; i++) {
          ids.push(len[i].permissionId)
        }
      }
      parms.permissionIds = ids.join(',')
      RolePermission(parms)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '配置权限成功！'
            })
            this.getdata(this.formInline)
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('配置权限失败,请稍后再试！')
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

