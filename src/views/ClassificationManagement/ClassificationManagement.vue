<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getListApi } from '@/api/classificationInfo'
import { formatTime } from '@/utils/index'
import TableTop from '@/components/TableTop/TableTop.vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
const { t } = useI18n()
const dataArray = ref(['id', 'name', 'c_time', 'u_time'])
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
const { getList, getElTableExpose } = tableMethods
const columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'id',
    label: 'id'
  },
  {
    field: 'type_name',
    label: '类别名称'
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
            <ElButton type="danger" size="small" onClick={() => viewData(data)}>
              编辑
            </ElButton>
            <ElButton type="danger" size="small" onClick={() => editData(data)}>
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
//查看数据
const router = useRouter()
const viewData = (data) => {
  const taskID = data.row.taskID
  router.push({
    name: 'ExtensionResult',
    query: { taskID }
  })
}
//编辑
const editData = (data) => {
  console.log(data)
  extensionFn()
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
  selectedData.value = selected.map((i) => i.id)
  if (temp.value.length > selectedData.value.length) {
    cancelData.value = temp.value.filter((i) => !selectedData.value.includes(i))
    console.log(cancelData.value)
  }
}
watch(dataList, (newV) => {
  temp.value.push(...newV.map((i) => i.id))
  temp.value = [...new Set(temp.value)]
  if (isCheckedAll.value && !newV.some((i) => selectedData.value.includes(i.id))) {
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
const isDataExtension = ref(false)
const extensionFn = () => {
  isDataExtension.value = true
}
onMounted(async () => {})
</script>
<template>
  <AdvancedSearch
    :dataArray="dataArray"
    :total="total"
    :title="'商品分类管理'"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="primary" @click="extensionFn"> 添加分类 </ElButton>
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
      :pagination="{
        total: total
      }"
      @register="tableRegister"
      @selection-change="handleSelectionChange"
    />
  </ContentWrap>
</template>
<style scoped></style>
