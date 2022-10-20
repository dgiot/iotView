# amis-vue-template

> 这是根据花裤衩大神的vue-admin-template极简管理后台搭建的，里面仅仅集成amis低代码开发最基本的依赖，可以支持vue+amis混合开发，在对原项目入侵最小的情况下实现amis代码开发渲染。其构建和运行完全遵照vue-admin-template，需要说明的是跳转amis低代码开发的页面时，仅需在路由元信息配置以下一个参数，如下：

```javasrcipt

  {
    path: '/amis',
    component: Layout,
    redirect: '/amis/theme',
    name: 'Amis',
    meta: {
      title: 'Amis',
      icon: 'nested'
    },
    children: [
      {
        path: '/tabs',
        name: 'tabs',
        component: () => import('@/views/amis/index'),
        meta: { title: 'tabs', icon: 'form', amisComponent: '/amis/tabs' }
      },
      {
        path: '/table',
        name: 'table',
        component: () => import('@/views/amis/index'),
        meta: { title: 'table', icon: 'form', amisComponent: '/amis/table' }
      }
    ]
  },

```

我们在路由元信息meta中添加了amisComponent参数，用于指向amis低代码开发的.json文件，该文件应当位于目录views下，可以和.vue文件放在一起，也可以单独新建目录存放，但必须在目录views下。路径的末尾应当指向.json文件，但不用添加文件扩展名.json

想深入了解vue-admin-template，请可以继续往下阅读，或者移步[作者主页](https://github.com/PanJiaChen)

[线上地址](http://panjiachen.github.io/vue-admin-template)

[国内访问](https://panjiachen.gitee.io/vue-admin-template)

目前版本为 `v4.0+` 基于 `vue-cli` 进行构建，若你想使用旧版本，可以切换分支到[tag/3.11.0](https://github.com/PanJiaChen/vue-admin-template/tree/tag/3.11.0)，它不依赖 `vue-cli`。

<p align="center">
  <b>SPONSORED BY</b>
</p>
<p align="center">
   <a href="https://finclip.com?from=vue_element" title="FinClip" target="_blank">
      <img height="200px" src="https://gitee.com/panjiachen/gitee-cdn/raw/master/vue%E8%B5%9E%E5%8A%A9.png" title="FinClip">
   </a>
</p>

## Extra

如果你想要根据用户角色来动态生成侧边栏和 router，你可以使用该分支[permission-control](https://github.com/PanJiaChen/vue-admin-template/tree/permission-control)

## 相关项目

- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

- [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)

- [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template)

- [awesome-project](https://github.com/PanJiaChen/vue-element-admin/issues/2312)

写了一个系列的教程配套文章，如何从零构建后一个完整的后台项目:

- [手摸手，带你用 vue 撸后台 系列一(基础篇)](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
- [手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac)
- [手摸手，带你用 vue 撸后台 系列三 (实战篇)](https://juejin.im/post/593121aa0ce4630057f70d35)
- [手摸手，带你用 vue 撸后台 系列四(vueAdmin 一个极简的后台基础模板,专门针对本项目的文章,算作是一篇文档)](https://juejin.im/post/595b4d776fb9a06bbe7dba56)
- [手摸手，带你封装一个 vue component](https://segmentfault.com/a/1190000009090836)

## Build Setup

```bash
# 克隆项目
git clone https://github.com/PanJiaChen/vue-admin-template.git

# 进入项目目录
cd vue-admin-template

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)

## License

[MIT](https://github.com/PanJiaChen/vue-admin-template/blob/master/LICENSE) license.

Copyright (c) 2017-present PanJiaChen
