<script setup lang="tsx">
import { ElDrawer } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addApi } from '@/api/goodsInfo'
import { Icon } from '@iconify/vue'
const { required } = useValidator()
defineProps({
  title: {
    type: String,
    default: ''
  },
  isDrawer: {
    type: Boolean,
    default: false
  }
})

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData } = formMethods
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
      placeholder: '请选择商品类别',
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
  console.log('打开')
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
      formData.goods_photo = formData.goods_photo.map((i) => i.raw)
      const res = await addApi(formData)
      if (res.code == 0) {
        close()
        ElMessage.success('添加信息成功')
      }
    }
  })
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

    <template #footer>
      <div style="margin-right: 20px">
        <BaseButton type="default" @click="resetClick">重 置</BaseButton>
        <BaseButton type="primary" @click="confirmClick">确 定</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>
<style lang="less" scope></style>
