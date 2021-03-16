// 按需加载要用到的组件
import { 
  Container,
  Header,
  Aside,
  Main,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Menu,
  Submenu,
  MenuItem,
  Divider,
  Row,
  Input,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  Pagination,
  Tooltip,
  Card,
  Dialog,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  DatePicker,
  Select,
  Option,
  OptionGroup,
  Radio,
  RadioGroup,
  Popover,
  Tree,
  MessageBox,
  Message,
  Loading,
  Checkbox,
  Upload,
  CheckboxGroup,
  Switch,
  Tabs,
  TabPane,
  Drawer,
  InputNumber,
  Collapse,
  CollapseItem,
  Cascader,
  RadioButton,
  Col,
  Tag,
  TimeSelect,
  Image,
  Link
} from 'element-ui'

const element = {
  install: function (Vue) {
    Vue.use(Container)
    Vue.use(Header)
    Vue.use(Aside)
    Vue.use(Main)
    Vue.use(Dropdown)
    Vue.use(DropdownMenu)
    Vue.use(DropdownItem)
    Vue.use(Avatar)
    Vue.use(Menu)
    Vue.use(Submenu)
    Vue.use(MenuItem)
    Vue.use(Divider)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Input)
    Vue.use(InputNumber)
    Vue.use(Button)
    Vue.use(ButtonGroup)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Pagination)
    Vue.use(Tooltip)
    Vue.use(Card)
    Vue.use(Dialog)
    Vue.use(Breadcrumb)
    Vue.use(BreadcrumbItem)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(DatePicker)
    Vue.use(TimeSelect)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(OptionGroup)
    Vue.use(Radio)
    Vue.use(RadioGroup)
    Vue.use(RadioButton)
    Vue.use(Popover)
    Vue.use(Tree)
    Vue.use(Checkbox)
    Vue.use(CheckboxGroup)
    Vue.use(Upload)
    Vue.use(Switch)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(Drawer)
    Vue.use(ButtonGroup)
    Vue.use(Collapse)
    Vue.use(CollapseItem)
    Vue.use(Cascader)
    Vue.use(Tag)
    Vue.use(Image)
    Vue.use(Link)

    Vue.use(Loading.directive)

    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$message = Message
    Vue.prototype.$loading = Loading.service
  }
}

export default element
