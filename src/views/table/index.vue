<template>
  <div class="p-5">
    <NTable
      height="600"
      :loading="loading"
      :data="data"
      :columns="columns"
      show-operation
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
    >
      <template #display_time="{ row }">
        <span>{{ row.display_time }}</span>
      </template>
    </NTable>
  </div>
</template>

<script>
import { noop } from 'lodash-es'
import { getList } from '@/api/table'
import NTable from '@/components/NTable'

export default {
  components: {
    NTable,
  },
  data() {
    return {
      data: [],
      columns: [
        {
          prop: 'display_time',
          label: '日期',
        },
        {
          prop: 'author',
          label: '姓名',
        },
        {
          prop: 'title',
          label: '标题',
        },
      ],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 200,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      const res = await getList().catch(noop)
      this.data = res.data.items
      this.total = res.data.total
      this.loading = false
    },
  },
}
</script>
