<template>
  <!-- input -->
  <el-input
    v-if="formData.formType === 'input'"
    v-model="returnFormValue[formData.code]"
    v-bind="realFormData"
    v-on="listeners"
  />

  <!-- textarea -->
  <el-input
    v-else-if="formData.formType === 'textarea'"
    v-model="returnFormValue[formData.code]"
    type="textarea"
    v-bind="realFormData"
    v-on="listeners"
  />

  <!-- date -->
  <el-date-picker
    v-else-if="formData.formType === 'date'"
    v-model="returnFormValue[formData.code]"
    v-bind="realFormData"
    v-on="listeners"
  />

  <!-- select -->
  <el-select
    v-else-if="formData.formType === 'select'"
    v-model="returnFormValue[formData.code]"
    class="w-full"
    v-bind="realFormData"
    v-on="listeners"
  >
    <el-option
      v-for="item in formData.data"
      :key="item[optionValue]"
      :label="item[optionLabel]"
      :value="item[optionValue]"
    ></el-option>
  </el-select>

  <!-- treeSelect -->
  <treeselect
    v-else-if="formData.formType === 'treeSelect'"
    v-model="returnFormValue[formData.code]"
    class="leading-normal py-2px"
    v-bind="realFormData"
    v-on="listeners"
  />

  <!-- radio -->
  <el-radio-group
    v-else-if="formData.formType === 'radio'"
    v-model="returnFormValue[formData.code]"
  >
    <el-radio v-for="item in formData.data" :key="item[optionValue]" :label="item[optionValue]">
      {{ item[optionLabel] }}
    </el-radio>
  </el-radio-group>

  <!-- checkbox -->
  <el-checkbox-group
    v-else-if="formData.formType === 'checkbox'"
    v-model="returnFormValue[formData.code]"
  >
    <el-checkbox
      v-for="item in formData.data"
      :key="item[optionValue]"
      :type="item.code"
      :label="item[optionValue]"
    >
      {{ item[optionLabel] }}
    </el-checkbox>
  </el-checkbox-group>

  <!-- switch -->
  <el-switch v-else-if="formData.formType === 'switch'" v-model="returnFormValue[formData.code]" />
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { pickBy, omitBy, startsWith } from 'lodash-es'

export default {
  name: 'NFormItem',
  components: {
    Treeselect,
  },
  props: {
    formData: {
      type: Object,
      required: true,
    },
    formValue: {
      type: Object,
      required: true,
    },
    // 下拉框
    optionLabel: {
      type: String,
      default: 'label',
    },
    optionValue: {
      type: String,
      default: 'value',
    },
  },
  computed: {
    returnFormValue() {
      return this.formValue
    },
    realFormData() {
      return omitBy(this.formData, (_, key) => startsWith(key, 'on'))
    },
    listeners() {
      return pickBy(this.formData, (_, key) => startsWith(key, 'on'))
    },
  },
}
</script>
