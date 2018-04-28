<template>
    <div class="google-map" :id="mapName"></div>
</template>

<script>
export default {
  name: 'google-map',
  props: ['name'],
  data: function () {
    return {
      mapName: this.name + "-map",
    }
  },
  mounted: function () {
    const element = document.getElementById(this.mapName)
    const options = {
      zoom: 14,
      center: new google.maps.LatLng(36,-78.93)
    }
    const map = new google.maps.Map(element, options);
  }
};
</script>

<style scoped>
.google-map {
  width: 800px;
  height: 600px;
  margin: 0 auto;
  background: gray;
}
</style>