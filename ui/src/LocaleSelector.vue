<template>
  <div>
    <select v-model="$i18n.locale">
      <option v-for="(lang, i) in langs" :key="`lang-${i}`" :value="lang">
        {{ lang }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
export default {
  name: "LocaleSelector",
  data(): Record<string, unknown> {
    return { langs: ["en", "es"] };
  },
};
</script>
