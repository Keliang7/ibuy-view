<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getListApi } from '@/api/userAddress'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import AddData from '@/components/AddData/AddData.vue'
import EditData from '@/components/EditData/EditData.vue'
import Mock from 'mockjs'
import { onMounted } from 'vue'
const { t } = useI18n()
const dataArray = ref(['id', 'user_id', 'c_time', 'u_time'])
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchData.value
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const { loading, total, dataList, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods
const columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'id',
    width: 150,
    label: 'id'
  },
  {
    field: 'user_id',
    width: 150,
    label: '用户id'
  },
  {
    field: 'user_address',
    label: '用户地址',
    formatter(data) {
      if (data.id === 1) return '湖北省武汉市武昌区白沙洲世贸云锦玉海园'
      if (data.id === 2) return '北京市北京市朝阳区东三环南路47号楼'
      if (data.id === 3) return '湖北省武汉市江夏区五栋621'
      if (data.id === 4) return '北京市北京市东城区荷华明城大厦'
      const province = Mock.mock('@province()') // 随机生成省份
      const city = Mock.mock('@city()') // 随机生成城市
      const area = Mock.mock('@county()') // 随机生成区县
      const street = Mock.mock('@ctitle(5, 10)') + '街道' // 随机生成街道名称
      // 组装地址字符串
      const address = `${province}${city}${area}${street}`
      return address
    }
  },
  {
    field: 'c_time',
    width: 200,
    label: '创建时间',
    formatter: (data) => formatTime(data.c_time, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'u_time',
    width: 200,
    label: '更新时间',
    formatter: (data) => formatTime(data.u_time, 'yyyy-MM-dd HH:mm:ss')
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    width: 200,
    fixed: 'right',
    headerAlign: 'center',
    align: 'center',
    slots: {
      default: (data) => {
        return (
          <div>
            <ElButton type="danger" size="small" onClick={() => editFn(data.row)}>
              编辑
            </ElButton>
            <ElButton type="danger" size="small" onClick={() => delFn(data)}>
              删除
            </ElButton>
          </div>
        )
      }
    }
  }
]
// 高级搜索功能，接收从AdvancedSearch组件中传过来的数据
const searchData = ref({})
const searchTable = async (value) => {
  searchData.value = value
  await getList()
}
//编辑
const isEditData = ref(false)
const editData = ref()
const editFn = (data) => {
  isEditData.value = true
  editData.value = data
}
//删除
const delLoading = ref(false)
const ids = ref<string[]>([])
const delFn = async (data) => {
  const elTableExpose = await getElTableExpose()
  ids.value = data ? [data.row.id] : elTableExpose?.getSelectionRows().map((v) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
//是否全选
const isCheckedAll = ref(false)
// 选择全部
const selectedData = ref<TableColumn[]>([])
const temp = ref<any[]>([])
const cancelData = ref<any[]>([])
const toggleSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.toggleAllSelection()
}
const handleSelectionChange = (selected: any[]) => {
  selectedData.value = selected.map((i) => i.ruleContent)
  if (temp.value.length > selectedData.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedData.value.includes(i))
    console.log(cancelData.value)
  }
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.ruleContent))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedData.value.includes(i.ruleContent))) {
    toggleSelection()
  }
})
const clearSelection = async () => {
  const elTableRef = await getElTableExpose()
  elTableRef?.clearSelection()
}
watch(isCheckedAll, () => {
  if (isCheckedAll.value) {
    toggleSelection()
  } else {
    clearSelection()
  }
})
//导出数据
const isDrawerExportFile = ref(false)
const initExportDate = ref({})
const getSelections = () => {
  if (isCheckedAll.value) {
    initExportDate.value = {
      count: unref(total) - cancelData.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        arrayNot: cancelData.value
      }
    }
  } else {
    initExportDate.value = {
      count: selectedData.value.length,
      exportDate: {
        exportAll: isCheckedAll.value,
        ruleContents: selectedData.value
      }
    }
  }
  isDrawerExportFile.value = true
}
//创建任务
const isAddData = ref(false)
const addDataFn = () => {
  isAddData.value = true
}
onMounted(async () => {})
</script>
<template>
  <AdvancedSearch
    :dataArray="dataArray"
    :total="total"
    :title="'用户地址管理'"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="primary" @click="addDataFn"> 添加信息 </ElButton>
        <ElButton type="primary" @click="getSelections">
          <Icon icon="tdesign:upload" /> 导出数据
        </ElButton>
      </template>
    </TableTop>
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      stripe
      row-key="id"
      :reserve-selection="true"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      :image-preview="['avatar']"
      :pagination="{
        total: total
      }"
      @register="tableRegister"
      @selection-change="handleSelectionChange"
    />
  </ContentWrap>
  <AddData v-model:isDrawer="isAddData" :title="'添加用户信息'" />
  <EditData v-model:isDrawer="isEditData" :title="'修改用户信息'" :edit-data="editData" />
</template>
<style scoped></style>
