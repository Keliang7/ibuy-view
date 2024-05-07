<script setup lang="tsx">
import { ElDrawer } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { BaseButton } from '@/components/Button'
import { useValidator } from '@/hooks/web/useValidator'
import { ref, unref } from 'vue'
import { ElMessage } from 'element-plus'
import { addApi } from '@/api/userInfo'
import { ImageCropping } from '@/components/ImageCropping'
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
  editData: {
    type: Object as () => { avatar: string; [key: string]: any },
    default: () => ({
      avatar: ''
    })
  }
})

const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData, setValues } = formMethods
const schema = ref<FormSchema[]>([
  {
    field: 'account',
    label: '账号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入账号'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'password',
    label: '密码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入密码'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'tele',
    label: '电话',
    component: 'Input',
    componentProps: {
      placeholder: '请输入电话'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'nick_name',
    label: '名字',
    component: 'Input',
    componentProps: {
      placeholder: '请输入名字'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    componentProps: {
      placeholder: '请输入邮箱'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'avatar',
    label: '头像',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      disabled: true
    },
    formItemProps: {
      rules: [required('请点击下方上传头像')]
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
  if (props.editData) {
    setValues({
      account: props.editData.account,
      password: props.editData.password,
      tele: props.editData.tele,
      nick_name: props.editData.nick_name,
      email: props.editData.email,
      avatar: props.editData.avatar
    })
  }
  console.log('打开')
}
// 重置
const resetClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
}
//头像
const cropperExpose = ref<InstanceType<typeof ImageCropping>>()
const base64 = ref('')
const getBase64 = () => {
  base64.value = unref(cropperExpose)?.cropperExpose?.getCroppedCanvas()?.toDataURL() ?? ''
  setValues({ avatar: base64.value })
}
// 查询
const confirmClick = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.validate(async (isValid) => {
    if (isValid) {
      const formData = await getFormData()
      const res = await addApi({ avatar: base64, ...formData })
      console.log(formData)
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
    <div class="px-20px">
      <ImageCropping
        :is-col="true"
        ref="cropperExpose"
        box-width="100%"
        :crop-box-width="200"
        image-url="https://cdn.i-scmp.com/sites/default/files/styles/1200x800/public/d8/images/methode/2020/08/28/feff9674-e6aa-11ea-8600-abe4f45458c9_image_hires_135629.jpg?itok=on_VjQbW&v=1598594196"
      />
      <BaseButton type="primary" class="mb-20px" @click="getBase64">裁剪</BaseButton>
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
