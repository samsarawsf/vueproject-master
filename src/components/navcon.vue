/**
* 头部菜单
*/
<template>
  <div>
    <el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff">
      <el-button class="buttonimg">
        <img class="showimg" :src="collapsed?imgsq:imgshow" @click="toggle(collapsed)">
      </el-button>
      <el-submenu index="2" class="submenu">
        <!-- <template slot="title">{{user.userRealName}}</template> -->
        <template slot="title">{{user.data.nickName}}</template>
        <el-menu-item  @click="content('content')" index="2-1">个人中心</el-menu-item>
        <el-menu-item @click="content('pwd')" index="2-2">修改密码</el-menu-item>
        <el-menu-item @click="exit()" index="2-3">退出</el-menu-item>
      </el-submenu>
    </el-menu>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editForm" :model="editForm" :rules="rules">
       <el-form-item label="姓名" prop="nickName">
          <el-input size="small" v-model="editForm.nickName" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input size="small" v-model="editForm.phonenumber" placeholder="请输入手机号"></el-input>
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
        <el-button size="small" type="primary"  class="title" @click="submitFormContent()">保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="resetPassword" width="50%" @click="closeDialog">
      <h2 align="center">你好！{{ user.data.nickName }} 同学</h2>
      <el-form :model="passForm" status-icon :rules="rules" ref="passForm" label-width="100px">
        <el-form-item label="旧密码" prop="currentPass">
          <el-input type="password" v-model="passForm.currentPass" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="passForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="passForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
          <el-button @click="resetForm('passForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {getUserDetail, loginout, updateContent, updatePwd, userSave} from '../api/userMG'
export default {
  name: 'navcon',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      collapsed: true,
      imgshow: require('../assets/img/show.png'),
      imgsq: require('../assets/img/sq.png'),
      user: {},
      title:'',
      resetPassword: false, //控制修改页面的显示与隐藏
      editFormVisible: false,
      // 编辑与添加
      editForm: {
        id: '',
        nickName: '',
        phonenumber: '',
        sex: '',
        email: '',
        // token: localStorage.getItem('logintoken')
      },
      passForm: {
        password: '',
        checkPass: '',
        currentPass: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在  到 9 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        currentPass: [
          { required: true, message: '请输入当前密码', trigger: 'blur' },
        ],
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        nickName: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        roleId: [{required: true, message: '请选择角色', trigger: 'blur'}],
        phonenumber: [
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
        sex: [{required: true, message: '请选择性别', trigger: 'blur'}]
      }
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.user = JSON.parse(localStorage.getItem('userdata'))
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let parm = {
            id: this.user.data.id,
            currentPass:this.passForm.currentPass,
            password:this.passForm.password
          }
          // console.log(parm)
          updatePwd(parm)
            .then(res =>{
              if (res.status !== 200) {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }else{
                this.$message({
                  type: 'success',
                  message: "修改成功即将跳转登录页"
                })
                loginout()
                  .then(res => {
                    if (res.status ===200) {
                      //如果请求成功就让他2秒跳转路由
                      setTimeout(() => {
                        this.$store.commit('logout', 'false')
                        this.$router.push({ path: '/login' })
                        this.$message({
                          type: 'success',
                          message: '请重新登录!'
                        })
                      }, 1000)
                    } else {
                      this.$message.error(res.msg)
                      this.logining = false
                      return false
                    }
                  })
              }
            })
        } else {

        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.resetPassword = false
    },
    // 退出登录
    exit() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // setTimeout(() => {
          //   this.$store.commit('logout', 'false')
          //   this.$router.push({ path: '/login' })
          //   this.$message({
          //     type: 'success',
          //     message: '已退出登录!'
          //   })
          // }, 1000)
          loginout()
            .then(res => {
              if (res.status ===200) {
                //如果请求成功就让他2秒跳转路由
                setTimeout(() => {
                  this.$store.commit('logout', 'false')
                  this.$router.push({ path: '/login' })
                  this.$message({
                    type: 'success',
                    message: '已退出登录!'
                  })
                }, 1000)
              } else {
                this.$message.error(res.msg)
                this.logining = false
                return false
              }
            })
            .catch(err => {
              // 获取图形验证码
              this.getcode()
              this.logining = false
              this.$message.error('退出失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    submitFormContent(){
      updateContent(this.editForm)
        .then(res => {
          this.editFormVisible = false
          if (res.status ===200) {
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
    },
    content(dialog){
      // this.$router.push({ path: '/resetPassword' })
      // console.log(this.user)
      if(dialog==='pwd'){
        this.title='修改密码',
        this.resetPassword=true
      }
      if(dialog==='content'){
        this.title='修改个人信息'
        this.editFormVisible=true
        let parm={
          id: this.user.data.id
        }
        getUserDetail(parm)
          .then(res => {
            this.editForm.nickName =res.data.nickName
            this.editForm.phonenumber =res.data.phonenumber
            this.editForm.sex =res.data.sex
            this.editForm.email =res.data.email
            this.editForm.id =res.data.id
          })
      }
    }
    ,
    // 切换显示
    toggle(showtype) {
      this.collapsed = !showtype
      this.$root.Bus.$emit('toggle', this.collapsed)
    }
  }
}
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.submenu {
  float: right;
}
.buttonimg {
  height: 60px;
  background-color: transparent;
  border: none;
}
.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}
.showimg:active {
  border: none;
}
.el-form {
  width: 420px;
  margin: 50px auto;
}
</style>
