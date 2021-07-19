import defaultSettings from '/config/settings'

const { tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
}

const mutations = {
  CHANGE_SETTING(state, { key, value }) {
    if (Object.prototype.hasOwnProperty.call(state, key)) state[key] = value
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
