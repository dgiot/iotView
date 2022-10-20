# amis-vue-template

English | [简体中文](./README-zh.md)

> This is built according to the vue-admin-template minimalist management background of huaunderpants great God. It only integrates the most basic dependency of Amis low code development, and can support vue+amis mixed development to achieve Amis code development rendering with minimal invasion of the original project. Its construction and operation fully comply with vue-admin-template. It should be noted that when jumping to the page of low code development of Amis, only one of the following parameters needs to be configured in the routing meta information, as follows:

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

We have added the amiscomponent parameter in the routing meta information meta to point to the .json file of Amis low code development, which should be located in the directory views and can be compared with Vue files can also be stored together in a new directory, but they must be under the directory views. The end of the path should point to the .json file without adding the file extension .json

To learn more about vue-admin-template, please continue to read it or move to [author's home page](https://github.com/PanJiaChen)

**Live demo:** <http://panjiachen.github.io/vue-admin-template>

**The current version is `v4.0+` build on `vue-cli`. If you want to use the old version , you can switch branch to [tag/3.11.0](https://github.com/PanJiaChen/vue-admin-template/tree/tag/3.11.0), it does not rely on `vue-cli`**

<p align="center">
  <b>SPONSORED BY</b>
</p>
<p align="center">
   <a href="https://finclip.com?from=vue_element" title="FinClip" target="_blank">
      <img height="200px" src="https://gitee.com/panjiachen/gitee-cdn/raw/master/vue%E8%B5%9E%E5%8A%A9.png" title="FinClip">
   </a>
</p>

## Build Setup

```bash
# clone the project
git clone https://github.com/PanJiaChen/vue-admin-template.git

# enter the project directory
cd vue-admin-template

# install dependency
npm install

# develop
npm run dev
```

This will automatically open <http://localhost:9528>

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Refer to [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) for more information

## Demo

![demo](https://github.com/PanJiaChen/PanJiaChen.github.io/blob/master/images/demo.gif)

## Extra

If you want router permission && generate menu by user roles , you can use this branch [permission-control](https://github.com/PanJiaChen/vue-admin-template/tree/permission-control)

For `typescript` version, you can use [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) (Credits: [@Armour](https://github.com/Armour))

## Related Project

- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

- [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)

- [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template)

- [awesome-project](https://github.com/PanJiaChen/vue-element-admin/issues/2312)


## License

[MIT](https://github.com/PanJiaChen/vue-admin-template/blob/master/LICENSE) license.

