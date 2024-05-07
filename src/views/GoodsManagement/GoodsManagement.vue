<script setup lang="tsx">
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch.vue'
import { ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getListApi, deleteApi } from '@/api/goodsInfo'
import { formatTime } from '@/utils/index'
import { TableData } from '@/api/table/types'
import TableTop from '@/components/TableTop/TableTop.vue'
import { onMounted } from 'vue'
import AddGoods from '@/components/AddGoods/AddGoods.vue'
import EditGoods from '@/components/EditGoods/EditGoods.vue'
const { t } = useI18n()
const dataArray = ref([
  'id',
  'goods_name',
  'goods_price',
  'goods_info',
  'goods_type',
  'c_time',
  'u_time'
])
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
  },
  fetchDelApi: async () => {
    const res = await deleteApi(unref(ids))
    return !!res
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
    label: 'id'
  },
  {
    field: 'goods_name',
    width: 150,
    label: '商品名称'
  },
  {
    field: 'goods_show_price',
    width: 150,
    label: '商品价格'
  },
  {
    field: 'goods_detail',
    width: 150,
    label: '商品详情'
  },
  {
    field: 'goods_class_id',
    width: 150,
    label: '商品类别'
  },
  {
    field: 'goods_photo',
    width: 100,
    label: '商品图片'
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
            <ElButton size="small" onClick={() => editFn(data.row)}>
              编辑
            </ElButton>
            <ElButton type="danger" size="small" onClick={() => delData(data.row)}>
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
//删除
const ids = ref<string[]>([])
const delData = async (row: TableData | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: TableData) => v.id) || []
  console.log(ids.value)
  await delList(unref(ids).length)
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
const isAddGoods = ref(false)
const addGoodsFn = () => {
  isAddGoods.value = true
}
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
const isEditGoods = ref(false)
const editData = ref()
const editFn = (row) => {
  editData.value = row
  isEditGoods.value = true
}
onMounted(async () => {})
</script>
<template>
  <AdvancedSearch
    :dataArray="dataArray"
    :total="total"
    :title="'商品信息管理'"
    tip-title="表格商品图片默认只显示第一张海报，其他图片请点击预览"
    @search-data="searchTable"
  />
  <ContentWrap>
    <TableTop>
      <template #right>
        <ElButton type="default">
          <ElCheckbox v-model="isCheckedAll" label="选择全部" size="large" />
        </ElButton>
        <ElButton type="primary" @click="addGoodsFn"> 添加商品 </ElButton>
        <ElButton type="danger" @click="delData(null)"> 删除商品 </ElButton>
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
      :image-preview="['goods_photo']"
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
  <AddGoods v-model:isDrawer="isAddGoods" :title="'添加商品信息'" />
  <EditGoods v-model:isDrawer="isEditGoods" :title="'修改商品信息'" :data="editData" />
</template>
<style scoped></style>
