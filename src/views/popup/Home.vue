<template>
  <div id="popup-home">
    <h1>Popup Demo</h1>
  </div>
</template>

<script>
export default {
  name: 'PopupHome',
  methods: {
    show() {
      console.log('show')
    }
  }
}
</script>

<style lang="scss">
#popup-home {
  width: 300px;
  text-align: center;
  h1 {
    font-size: 32px;
  }

  button {
    margin: 10px 10px 0 0;
  }
}
</style>
