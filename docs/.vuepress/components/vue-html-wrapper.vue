<template>
  <div>
    <slot name="example"></slot>
  </div>
</template>

<script>
export default {
  name: 'vue-html-wrapper',
}
</script>

<style scoped>
  @import '/assets/css/bootstrap.min.css';

  /* undo some of the vuepress styles */

  .content:not(.custom) a:hover {
    text-decoration: none;
  }

</style>
