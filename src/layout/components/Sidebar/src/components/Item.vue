<template>
  <div>
    <template v-if="icon">
      <i v-if="icon.includes('el-icon')" :class="[icon, 'sub-el-icon']" />
      <svg-icon v-else :icon-class="icon" />
    </template>
    <span class="inline-block max-w-28 truncate">{{ title }}</span>
    <el-badge v-if="menuBadge" v-bind="menuBadge" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  // eslint-disable-next-line
  props: ['icon', 'title', 'name'],
  computed: {
    ...mapGetters(['menuBadges']),
    menuBadge() {
      return this.menuBadges.find(item => item.name === this.name)
    },
  },
}
</script>

<style scoped>
.el-badge >>> .el-badge__content {
  position: relative;
  top: -19px;
}
</style>
