<template>
  <section>
    <b-sidebar type="is-light" v-bind="sidebarAttributes" v-model="open">
      <div class="p-1">
        <b-menu>
          <b-menu-list label="">
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
    <div class="block"></div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import eventBus from "./event-bus";
import NameTypeSelector from "./NameTypeSelector.vue";

export default Vue.extend({
  components: { NameTypeSelector },
  data() {
    return {
      sidebarAttributes: {
        overlay: false,
        fullheight: true,
        fullwidth: false,
        right: true,
      },
      open: false,
    };
  },
  mounted: function (): void {
    eventBus.$on("control-panel:show", () => {
      this.open = true;
    });
  },
});
</script>
