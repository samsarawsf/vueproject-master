# vue搭建后台管理界面模版（PC端）
------------------------



#### 技术栈
vue2 + vuex + vue-router + webpack + ES6/7 + axios + elementUI + 阿里图标iconfont


#### 说明

>  本项目主要用于熟悉如何用 vue2 架构一个后端管理平台项目

>  为了方便后期修改使用，模拟数据在页面中，具体修改看下面【强调】

>  如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

>  或者您可以 "follow" 一下，我会不断开源更多的有趣的项目



>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍


#### 目录结构
------------------------

```bash
├── /build/          # 项目构建(webpack)相关配置
├── /config/         # 项目开发环境配置
├── /src/            # 源码目录
│ ├── /api/          # 请求
│ ├── /assets/       # 组件静态资源(图片)
│ ├── /components/   # 公共组件
| ├── /api/          # 请求接口
│ ├── /router/       # 路由配置
│ ├── /vuex/         # vuex状态管理
│ ├── /views/        # 路由组件(页面维度)
│ ├── /config/       # 接口配置文件（请求地址）
│ ├── App.vue        # 组件入口
│ └── main.js        # 程序入口
├── /static/         # 非组件静态资源
├── .babelrc         # ES6语法编译配置
├── .editorconfig    # 定义代码格式
├── .eslintignore    # ES6规范忽略文件
├── .eslintrc.js     # ES6语法规范配置
├── .gitignore       # git忽略文件
├── index.html       # 页面入口
├── package.json     # 项目依赖
└── README.md        # 项目文档
```


#### 完成功能
- [x] 登录 -- 完成
- [x] 路由拦截 -- 完成
- [x] 角色管理（增加、编辑、搜索、删除、权限管理） -- 完成
- [x] 用户管理（增加、编辑、搜索、删除、数据权限、刷新缓存） -- 完成
- [x] 权限管理（增加、编辑、搜索、删除、配置权限） -- 完成
- [x] 菜单管理（增加、编辑、搜索、删除） -- 完成
- [x] 员工管理（增加、编辑、搜索、删除） -- 完成
- [x] 职位管理（增加、编辑、搜索、删除） -- 完成
- [x] 部门管理（增加、编辑、搜索、删除） -- 完成

### 说明
此项目是在github上找的一个前端的模板，然后我自己根据模板开发了一套



#### 运行项目
------------------------




``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test



