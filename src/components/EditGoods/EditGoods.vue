<script setup lang="tsx">
import { ElDrawer } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { editApi } from '@/api/goodsInfo'
import { Icon } from '@iconify/vue'
const { required } = useValidator()
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object
  }
})

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData, setValues } = formMethods
const schema = ref<FormSchema[]>([
  {
    field: 'goods_name',
    label: '商品名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入商品名称'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'goods_show_price',
    label: '商品价格',
    component: 'Input',
    componentProps: {
      placeholder: '请输入商品价格'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'goods_detail',
    label: '商品详情',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      placeholder: '请输入商品详情'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'goods_class_id',
    label: '商品类别',
    component: 'Select',
    componentProps: {
      placeholder: '请输入名字',
      options: [
        { label: '手机', value: 1 },
        { label: '平板', value: 2 },
        { label: '笔记本', value: 3 },
        { label: '衣服', value: 4 },
        { label: '家具', value: 5 },
        { label: '食品', value: 6 }
      ]
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'goods_photo',
    component: 'Upload',
    label: `商品图片`,
    componentProps: {
      limit: 9,
      autoUpload: false,
      listType: 'picture-card',
      multiple: true,
      slots: {
        default: () => <Icon color="5F80EC" icon="ep:plus" />
      }
    }
  }
])
//抽屉打开关闭
const emit = defineEmits(['update:isDrawer'])
const close = async () => {
  console.log('关闭弹窗')
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
  emit('update:isDrawer', false)
}
const open = () => {
  console.log(props.data)
  if (props.data) {
    setValues({
      goods_name: props.data.goods_name,
      goods_show_price: props.data.goods_show_price,
      goods_detail: props.data.goods_detail,
      goods_class_id: props.data.goods_class_id
    })
    oldImg.value = props.data.goods_photo
    id.value = props.data.id
  }
}
// 重置
const resetClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
// 查询
const confirmClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.validate(async (isValid) => {
    if (isValid) {
      const formData = await getFormData()
      if (formData.goods_photo) {
        formData.goods_photo = formData.goods_photo.map((i) => i.raw)
      }
      const res = await editApi({ ...formData, oldImg: oldImg.value, id: id.value })
      if (res.code == 0) {
        close()
        ElMessage.success('修改信息成功')
      }
    }
  })
}
const id = ref()
const oldImg = ref<any>()
const delOldImg = (url) => {
  oldImg.value = oldImg.value.filter((i) => i !== url)
}
</script>
<template>
  <ElDrawer
    :title="title"
    :modelValue="isDrawer"
    :before-close="close"
    custom-class="drawerWidth"
    @open="open"
  >
    <Form :autoSetPlaceholder="false" :schema="schema" @register="formRegister" :isCol="false" />
    <div class="flex px-10px w-full p-10px flex-wrap">
      <div v-for="item in oldImg" :key="item">
        <div class="w-130px aspect-ratio-square m-4px border-rd-10px position-relative"
          ><img
            :src="'api' + item"
            class="h-full object-contain b b-coolgray b-solid aspect-ratio-square border-rd-10px"
          />
          <div
            class="cursor-pointer del-icon w-12px h-12px bg-red position-absolute top-8px right-8px border-rd-6px flex justify-center items-center"
            ><Icon :size="10" icon="ep:close" @click="delOldImg(item)" />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="default" @click="resetClick">重 置</BaseButton>
        <BaseButton type="primary" @click="confirmClick">确 定</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>
<style lang="less" scope></style>
