<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { reactive, ref, onMounted, watch, defineEmits } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { Form, FormSchema } from '@/components/Form'
import { formatTime, Timestamp } from '@/utils'
import { BaseButton } from '@/components/Button'
import { ElRow, ElCol } from 'element-plus'
const props = defineProps({
  dataArray: {
    type: Array,
    default: null
  },
  title: {
    type: String
  },
  total: {
    type: Number
  },
  tipTitle: {
    type: String,
    default: ''
  }
})
const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData } = formMethods
const emit = defineEmits(['search-data'])
// 查询到的表格数据
let searchData = reactive({})
let schema = ref<FormSchema[]>([
  {
    field: 'id',
    label: 'id：',
    component: 'Input',
    componentProps: {
      placeholder: '请输入ID'
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'account',
    label: '账号：',
    component: 'Input',
    componentProps: {
      placeholder: '请输入账号'
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'tele',
    label: '电话号码：',
    component: 'Input',
    componentProps: {
      placeholder: '请输入电话号码'
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'nick_name',
    label: '昵称：',
    component: 'Input',
    componentProps: {
      placeholder: '请输入昵称'
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'email',
    label: '邮箱：',
    component: 'Input',
    componentProps: {
      placeholder: '请输入邮箱'
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'c_time',
    component: 'DatePicker',
    label: `创建时间：`,
    componentProps: {
      type: 'date',
      placeholder: formatTime(new Date(), 'yyyy-MM-dd')
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'u_time',
    component: 'DatePicker',
    label: `更新时间：`,
    componentProps: {
      type: 'date',
      placeholder: formatTime(new Date(), 'yyyy-MM-dd')
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'role_name',
    label: '角色：',
    component: 'Input',
    componentProps: {
      placeholder: '请输入角色名'
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'goods_name',
    label: '商品名称：',
    component: 'Input',
    componentProps: {
      placeholder: '请输入商品名'
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'goods_info',
    label: '商品详情：',
    component: 'Input',
    componentProps: {
      placeholder: '请输入商品详情'
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'user_id',
    label: '用户id',
    component: 'Input',
    componentProps: {
      placeholder: '请输入用户id'
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'name',
    label: '商品类别：',
    component: 'Select',
    componentProps: {
      options: [
        {
          value: '政府',
          label: '政府'
        },
        {
          value: '公检法部门',
          label: '公检法部门'
        },
        {
          value: '税务部门',
          label: '税务部门'
        },
        {
          value: '金融',
          label: '金融'
        }
      ],
      placeholder: '请选择商品类型'
    },
    colProps: {
      span: 12
    }
  }
])
let schemaCopy = ref<FormSchema[]>([])
const getShowData = () => {
  let temp = schema.value.filter((i) => props.dataArray.includes(i.field))
  temp.sort((a, b) => props.dataArray.indexOf(a.field) - props.dataArray.indexOf(b.field))
  schemaCopy.value = temp
}
onMounted(async () => {
  await getShowData()
})
// 当同一个页面，不同的高级搜索组件进行切换时，需要用watch来监听变化。
watch(() => props.dataArray, getShowData)
// 重置
const verifyReset = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
// 查询
const searchFn = async () => {
  const formData = await getFormData()
  if (formData.discoveryTime) formData.discoveryTime = Timestamp(formData.discoveryTime)
  let temp = formData.createdTime
  let startTime = Timestamp(temp?.[0])
  let endTime = Timestamp(temp?.[1])
  delete formData.createdTime
  if (temp) {
    searchData = { ...formData, startTime, endTime }
  } else {
    searchData = formData
  }
  console.log('advanceSearch-searchData', searchData)
  emit('search-data', searchData)
}
</script>
<template>
  <ContentWrap class="advance-search" style="margin-bottom: 20px">
    <ElRow class="mb-1rem">
      <ElCol :span="8">
        <div class="title flex">
          <h3 class="m-0">{{ title }}</h3>
          <span
            v-if="total"
            class="bg-#0B56FA text-white font-size-12px ml-8px px-6px border-rounded-2px flex items-center"
            >{{ total }}</span
          >
        </div>
      </ElCol>
      <ElCol :span="8" v-if="tipTitle">
        <div class="flex justify-center items-center h-100%">
          <div class="bg-#D3DEFE font-size-12px p-8px flex items-center border-rounded-4px">
            <div
              class="border-rounded-2 bg-#0B56FA w-16px h-16px flex justify-center items-center text-white ml-4px mr-4px"
              >i</div
            >
            温馨提示：{{ tipTitle }}
          </div>
        </div>
      </ElCol>
    </ElRow>
    <Form :autoSetPlaceholder="false" :schema="schemaCopy" @register="formRegister" />
    <div class="height-32px float-right p-10px">
      <BaseButton type="default" @click="verifyReset"> 重置 </BaseButton>
      <BaseButton type="primary" @click="searchFn"> 查询 </BaseButton>
    </div>
  </ContentWrap>
</template>
<style lang="less" scoped></style>
