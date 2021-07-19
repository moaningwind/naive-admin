import { createSessionStorage } from '@/utils/cache'

const Storage = createSessionStorage()

const state = {
  menuBadges: Storage.get('menuBadges', []),
}

const mutations = {
  ADD_MENU_BADGE(state, badge) {
    const index = state.menuBadges.findIndex(item => item.name === badge.name)
    if (index === -1) {
      state.menuBadges.push(badge)
    } else {
      state.menuBadges.splice(index, 1, badge)
    }
    Storage.set('menuBadges', state.menuBadges)
  },
  DEL_MENU_BADGE(state, badge) {
    const index = state.menuBadges.findIndex(item => item.name === badge.name)
    if (index === -1) return
    state.menuBadges.splice(index, 1)
    Storage.set('menuBadges', state.menuBadges)
  },
  DEL_All_MENU_BADGE(state) {
    state.menuBadges = []
    Storage.remove('menuBadges')
  },
}

const actions = {
  addMenuBadge({ commit }, badge) {
    commit('ADD_MENU_BADGE', badge)
  },
  delMenuBadge({ commit }, badge) {
    commit('DEL_MENU_BADGE', badge)
  },
  delAllMenuBadge({ commit }) {
    commit('DEL_All_MENU_BADGE')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
