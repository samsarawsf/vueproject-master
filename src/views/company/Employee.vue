/**
* 公司管理 员工管理
*/
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.isLock" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value=0></el-option>
          <el-option label="已锁定" value=1></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.name" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.phoneNumber" placeholder="输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
        <el-button size="small" type="primary" @click="handleunit()">部门设置</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="userData" highlight-current-row v-loading="loading"
              border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="id" label="编号" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="dept.name" label="所属部门" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="job.name" label="所在岗位" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="phoneNumber" label="手机号" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="sex" label="性别" min-width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="email" label="邮件" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="education" label="学历" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="birthday" label="生日" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.birthday|timestampToTime }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="status" label="状态" min-width="50">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status==='0'?nshow:fshow" active-color="#13ce66" inactive-color="#ff4949"
                     @change="editType(scope.$index, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
       </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="编号" prop="id">
          <el-input size="small" v-model="editForm.id" auto-complete="off" placeholder="" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off"  placeholder="请输入姓名" @blur="checkUserName(editForm.userName)"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input size="small" v-model="editForm.phoneNumber" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
<!--          <el-input  placeholder="请输入生日"></el-input>-->
          <el-date-picker size="small" v-model="editForm.ibirthday" type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-input size="small" v-model="editForm.education" auto-complete="off" placeholder="请输入学历"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="editForm.sex" label="男">男</el-radio>
          <el-radio v-model="editForm.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input size="small" v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm(editForm)">保存
        </el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dataAccessshow" width="20%" @click='closeDialog("perm")'>
     <p align="center">分配新角色:
       <el-select v-model="selectedRoleId" placeholder="请选择">
         <el-option
           v-for="item in roleList"
           :key="item.id"
           :label="item.name"
           :value="item.id">
         </el-option>
       </el-select></p>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("perm")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="menuPermSave">保存</el-button>
      </div>
    </el-dialog>
    <!-- 所属单位 -->
    <el-dialog title="所属单位" :visible.sync="unitAccessshow" width="30%" @click='closeDialog("unit")'>
      <el-tree ref="tree" default-expand-all="" :data="UserDept" :props="defaultProps" @check-change="handleClick"
               :default-checked-keys="checkmenu" node-key="id" show-checkbox check-strictly>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("unit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="unitPermSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入请求方法
import {
  userList,
  userSave,
  userDelete,
  userPwd,
  userExpireToken,
  userFlashCache,
  userStatus,
  changeRole,
  UserDeptSave,
  UserDeptdeptTree,
  UserChangeDept, roleList, checkUserName, empList, empStatus, empSave, empDelete
} from '../../api/userMG'
import Pagination from '../../components/Pagination'

export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      title: '添加用户',
      editFormVisible: false, //控制编辑页面显示与隐藏
      dataAccessshow: false, //控制数据权限显示与隐藏
      unitAccessshow: false, //控制所属单位隐藏与显示
      // 编辑与添加
      editForm: {
        id: '',
        name: '',
        education: '',
        phoneNumber: '',
        sex: '',
        email: '',
        ibirthday: ''
        // token: localStorage.getItem('logintoken')
      },
      // 部门参数
      unitparm: {
        userIds: '',
        deptId: '',
        deptName: ''
      },
      // 选择数据
      selectdata: [],
      // rules表单验证
      rules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        roleId: [{required: true, message: '请选择角色', trigger: 'blur'}],
        phoneNumber: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {
            pattern: /^1(3\d|47|5((?!4)\d)|7(0|1|[6-8])|8\d)\d{8,8}$/,
            required: true,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            required: true,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
        education :[{required: true, message: '请输入学历', trigger: 'blur'}]
      },
      // 删除用户
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      // 重置密码
      resetpsd: {
        userId: '',
        token: localStorage.getItem('logintoken')
      },
      // 用户下线
      offline: {
        token: localStorage.getItem('logintoken')
      },
      // 请求数据参数
      formInline: {
        page: 1,
        limit: 10,
        name: '',
        phoneNumber: '',
        isLock: ''
      },
      //用户数据
      userData: [],
      // 数据权限
      UserDept: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleList: [],
      userId:'',
      selectedRoleId:'',
      // 选中
      checkmenu: [],
      //参数role
      saveroleId: '',
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
    // this.getAll()
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取数据方法
    getdata(parameter) {
      this.loading = true
      // console.log(parameter)

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      // 获取用户列表
      empList(parameter).then(res => {
        this.loading = false
        if (res.status !== 200) {
          // console.log(res)
          this.$message({
            type: 'info',
            message: res.msg
          })
        } else {
          // console.log(res)
          this.userData = res.data.records
          // 分页赋值
          this.pageparm.currentPage = this.formInline.page
          this.pageparm.pageSize = this.formInline.limit
          this.pageparm.total = res.data.total
        }
      })
        // ,
        // roleList()
        //   .then(res => {
        //     this.loading = false
        //     if (res.status !==  200) {
        //       this.$message({
        //         type: 'info',
        //         message: res.msg
        //       })
        //     } else {
        //       this.roleList = res.data.records
        //     }
        //   })
        //   .catch(err => {
        //     this.loading = false
        //     this.$message.error('获取角色列表失败，请稍后再试！')
        //   })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    //搜索事件
    search() {
      this.getdata(this.formInline)
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
      empStatus(parm).then(res => {
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
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true
      if (row !== undefined && row !== 'undefined') {
        this.title = '修改用户'
        this.editForm.id = row.id
        this.editForm.name = row.name
        this.editForm.ibirthday = row.birthday
        this.editForm.phoneNumber = row.phoneNumber
        this.editForm.sex = row.sex
        this.editForm.email = row.email
        this.editForm.education = row.education
      } else {
        this.title = '添加用户'
        this.editForm.id = ''
        this.editForm.name = ''
        this.editForm.ibirthday = ''
        this.editForm.phoneNumber = ''
        this.editForm.sex = ''
        this.editForm.email = ''
        this.editForm.education = ''
      }
    },
    // 编辑、添加提交方法
    submitForm(editData) {
      this.editForm.ibirthday=this.editForm.ibirthday.substr(0,10)
      empSave(this.editForm)
        .then(res => {
          this.editFormVisible = false
          this.loading = false
          if (res.status ===200) {
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
          this.$message.error('保存失败，请稍后再试！')
        })


    },
    // 显示部门设置
    handleunit: function (index, row) {
      this.unitAccessshow = true
      let parms = 0
      UserDeptdeptTree(parms)
        .then(res => {
          if (res.data.success) {
            this.UserDept = this.changeArr(res.data.data)
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
    handleClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([])
        this.$refs.tree.setCheckedNodes([data])
        this.unitparm.deptId = data.id
        this.unitparm.deptName = data.name
        //交叉点击节点
      } else {
      }
    },
    // 保存部门
    unitPermSave() {
      let len = this.selectdata
      let ids = []
      if (len != 0) {
        for (let i = 0; i < len.length; i++) {
          ids.push(len[i].userId)
        }
      }
      this.unitparm.userIds = ids.join(',')
      UserChangeDept(this.unitparm)
        .then(res => {
          this.unitAccessshow = false
          if (res.success) {
            this.$message({
              type: 'success',
              message: '部门设置成功！'
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
          this.$message.error('部门设置失败,请稍后再试！')
        })
    },
    // 选择复选框事件
    selectChange(val) {
      this.selectdata = val
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog == 'edit') {
        this.editFormVisible = false
      } else if (dialog == 'perm') {
        this.dataAccessshow = false
      } else if (dialog == 'unit') {
        this.unitAccessshow = false
      }
    },
    // 删除用户
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
          // 删除
          // console.log(parm)
          empDelete(parm)
            .then(res => {
              if (res.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('数据删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          })
        })
    },
    // 重置密码
    resetpwd(index, row) {
      this.resetpsd.userId = row.userId
      this.$confirm('确定要重置密码吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let parm = {
            id: row.id
          }
          userPwd(parm)
            .then(res => {
              if (res.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('重置密码失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消重置密码！'
          })
        })
    },
    // 分配角色
    dataAccess: function (index, row) {
      this.dataAccessshow = true
      this.userId=row.id
    },

    // 分配角色-保存
    menuPermSave() {
      let parm={
        id: this.userId,
        roleId:this.selectedRoleId
      }
      changeRole(parm)
        .then(res => {
          if (res.status ===200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.dataAccessshow = false
            this.getdata(this.formInline)
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('获取权限失败，请稍后再试！')
        })
    },
    // 下线用户
    offlineUser(index, row) {
      this.$confirm('确定要让' + row.userName + '用户下线吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userExpireToken(row.userName)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '用户' + row.userName + '强制下线成功！'
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
              this.$message.error('用户下线失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 刷新缓存
    refreshCache(index, row) {
      userFlashCache(row.userName)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '刷新成功！'
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
          this.$message.error('刷新失败，请稍后再试！')
        })
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

