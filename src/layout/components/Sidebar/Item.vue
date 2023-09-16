<script>
import Cookies from 'js-cookie'
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} style='font-size: 25px;'/>)
      } else if (icon.includes('dgiot_file')) {
        // sidebarStatus 1 打开侧边栏 0 关闭侧边栏
        if (Cookies.get('sidebarStatus') == '1') {
          vnodes.push(
            <div style='display:inline-block;text-align:center;'>
              <img
                style='height:30px;width:30px;margin-right: 12px;'
                src={Vue.prototype.$FileServe + icon}
              />
            </div>
          )
        } else {
          vnodes.push(
            <div style='display:inline-block;text-align:center;margin-left: 18px;'>
              <img
                style='height:30px;width:30px;'
                src={Vue.prototype.$FileServe + icon}
              />
            </div>
          )
        }
      } else {
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{title}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
