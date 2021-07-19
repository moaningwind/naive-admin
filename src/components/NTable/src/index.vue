<template>
  <div class="n-table">
    <!-- toolbar -->
    <div v-if="showToolbar" class="toolbar">
      <div>
        <slot name="toolbar-left" />
      </div>
      <div>
        <div v-if="showCustomColumn">
          <el-dropdown split-button type="primary">
            自定义列
            <template #dropdown>
              <el-dropdown-menu class="custom-column-dropdown">
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAll"
                >
                  全选
                </el-checkbox>
                <el-checkbox-group
                  v-model="checkedColumns"
                  class="custom-column-dropdown-checkbox-group"
                  @change="handleCheckedColumns"
                >
                  <el-checkbox v-for="column in columns" :key="column.prop" :label="column.label">
                    {{ column.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- elTable -->
    <el-table
      ref="elTable"
      v-loading="loading"
      class="el-table"
      v-bind="$attrs"
      v-on="getElTableListeners()"
    >
      <el-table-column v-if="showCheckbox" type="selection" width="40" />
      <el-table-column v-if="showLineNumber" type="index" align="center">
        <template #header="scope">
          <slot name="index-header" v-bind="scope">序号</slot>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in reallyShowColumn" :key="index" v-bind="item">
        <template v-if="$scopedSlots[`${item.prop}-header`]" #header="scope">
          <slot :name="`${item.prop}-header`" v-bind="scope" />
        </template>
        <template v-if="$scopedSlots[item.prop]" #default="scope">
          <slot :name="item.prop" v-bind="scope" />
        </template>
      </el-table-column>
      <el-table-column v-if="showOpnColumn" v-bind="opnColumnProps">
        <template #default="scope">
          <slot name="operation" v-bind="scope">
            <el-button v-spring size="mini" @click="handleEdit(scope)">编辑</el-button>
            <el-button v-spring size="mini" type="danger" @click="handleDelete(scope)">
              删除
            </el-button>
          </slot>
        </template>
      </el-table-column>
      <template #append>
        <slot name="append" />
      </template>
    </el-table>
    <!-- elPagination-->
    <el-pagination
      ref="elPagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { constant, omit } from 'lodash-es'
import waves from '@/directives/waves'
import spring from '@/directives/spring'

export default {
  name: 'NTable',
  directives: {
    waves,
    spring,
  },
  inheritAttrs: false,
  props: {
    showToolbar: {
      type: Boolean,
      default: true,
    },
    showCustomColumn: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: constant([]),
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    showLineNumber: {
      type: Boolean,
      default: true,
    },
    // show operation column
    showOpnColumn: {
      type: Boolean,
      default: false,
    },
    opnColumnProps: {
      type: Object,
      default() {
        return {
          width: 144,
          label: '操作',
          fixed: 'right',
          align: 'center',
        }
      },
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default: constant([10, 20, 30, 40, 50]),
    },
    total: {
      type: Number,
      default: 0,
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
  },
  data() {
    return {
      checkAll: false,
      checkedColumns: [],
      isIndeterminate: true,
    }
  },
  computed: {
    columnsLabel() {
      return this.columns.map(item => item.label)
    },
    reallyShowColumn() {
      return this.columns.filter(item => this.checkedColumns.includes(item.label))
    },
  },
  watch: {
    columns: {
      handler(newVal) {
        this.checkedColumns = newVal.map(item => item.label)
      },
      immediate: true,
    },
  },
  methods: {
    handleCheckAll(val) {
      this.checkedColumns = val ? this.columnsLabel : []
      this.isIndeterminate = false
    },
    handleCheckedColumns(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.columnsLabel.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnsLabel.length
    },

    handleEdit(scope) {
      this.$emit('handleEdit', scope)
      this.$emit('handle-edit', scope)
    },
    handleDelete(scope) {
      this.$emit('handleDelete', scope)
      this.$emit('handle-delete', scope)
    },

    handleCurrentChange(currentPage) {
      this.$emit('update:currentPage', currentPage)
      this.$emit('currentChange')
      this.$emit('current-change')
    },
    handleSizeChange(pageSize) {
      this.$emit('update:currentPage', 1)
      this.$emit('update:pageSize', pageSize)
      this.$emit('pageSizeChange')
      this.$emit('page-size-change')
    },

    callElTableMethod(methodName) {
      this.$refs.elTable && this.$refs.elTable[methodName]()
    },
    callElPaginationMethods(methodName) {
      this.$refs.elPagination && this.$refs.elPagination[methodName]()
    },

    getElTableListeners() {
      const omitListeners = [
        'handleEdit',
        'handle-edit',
        'handleDelete',
        'handle-delete',
        'update:currentPage',
        'update:current-page',
        'currentChange',
        'current-change',
        'update:pageSize',
        'update:page-size',
        'pageSizeChange',
        'page-size-change',
      ]
      return omit(this.$listeners, omitListeners)
    },
  },
}
</script>

<style lang="scss" scoped>
.n-table {
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-table {
    margin-top: 16px;
    margin-bottom: 16px;
  }
}

.custom-column-dropdown {
  max-height: 160px;
  overflow-y: auto;
  padding: 0 10px;

  &-checkbox-group {
    display: flex;
    flex-direction: column;
  }
}
</style>
