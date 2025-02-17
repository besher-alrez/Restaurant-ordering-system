<template>
  <nav class="sidebar-nav">
    <VuePerfectScrollbar class="scroll-area" :settings="psSettings" @ps-scroll-y="scrollHandle">
    <ul class="nav">
      <template v-for="(item, index) in navItems">
        <template v-if="item.access">
          <template v-if="item.title">
            <SidebarNavTitle :key="index" :name="item.name" :classes="item.class" :wrapper="item.wrapper"></SidebarNavTitle>
          </template>
          <template v-else-if="item.divider">
            <SidebarNavDivider :key="index" :classes="item.class"></SidebarNavDivider>
          </template>
          <template v-else-if="item.label">
            <SidebarNavLabel :key="index" :name="item.name" :url="item.url" :icon="item.icon" :label="item.label" :classes="item.class"></SidebarNavLabel>
          </template>
          <template v-else>
            <template v-if="item.children">
              <!-- First level dropdown -->
              <SidebarNavDropdown :key="index" :name="item.name" :url="item.url" :icon="item.icon">
                <template v-for="(childL1, index1) in item.children">
                  <template v-if="childL1.children">
                    <!-- Second level dropdown -->
                    <SidebarNavDropdown :key="index1" :name="childL1.name" :url="childL1.url" :icon="childL1.icon" v-if="childL1.access">
                      <li :key="index2" class="nav-item" v-for="(childL2, index2) in childL1.children" v-if="childL2.access">
                        <SidebarNavLink :name="childL2.name" :url="childL2.url" :icon="childL2.icon" :nav-items="navItems" :badge="childL2.badge" :variant="item.variant"></SidebarNavLink>
                      </li>
                    </SidebarNavDropdown>
                  </template>
                  <template v-else>
                    <SidebarNavItem :key="index1" :classes="item.class" v-if="childL1.access">
                      <SidebarNavLink :name="childL1.name" :url="childL1.url" :icon="childL1.icon" :nav-items="navItems" :badge="childL1.badge" :variant="item.variant"></SidebarNavLink>
                    </SidebarNavItem>
                  </template>
                </template>
              </SidebarNavDropdown>
            </template>
            <template v-else>
              <SidebarNavItem :key="index" :classes="item.class">
                <SidebarNavLink :name="item.name" :url="item.url" :icon="item.icon" :nav-items="navItems" :badge="item.badge" :variant="item.variant"></SidebarNavLink>
              </SidebarNavItem>
            </template>
          </template>
        </template>
      </template>
    </ul>
    <slot></slot>
    </VuePerfectScrollbar>
  </nav>
</template>

<script>
import SidebarNavDivider from './SidebarNavDivider'
import SidebarNavDropdown from './SidebarNavDropdown'
import SidebarNavLink from './SidebarNavLink'
import SidebarNavTitle from './SidebarNavTitle'
import SidebarNavItem from './SidebarNavItem'
import SidebarNavLabel from './SidebarNavLabel'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  name: 'SidebarNav',
  components: {
    SidebarNavDivider,
    SidebarNavDropdown,
    SidebarNavLink,
    SidebarNavTitle,
    SidebarNavItem,
    VuePerfectScrollbar,
    SidebarNavLabel
  },
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      psSettings: {
        maxScrollbarLength: 200,
        minScrollbarLength: 40,
        suppressScrollX: true,
        wheelPropagation: false,
        interceptRailY: (styles) => ({ ...styles, height: 0 })
      }
    }
  },
  methods: {
    scrollHandle (evt) {
    }
  }
}
</script>

<style scoped lang="css">
  .scroll-area {
    position: absolute;
    height: 100%;
    margin: auto;
  }
</style>
