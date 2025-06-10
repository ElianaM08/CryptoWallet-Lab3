<template>
  <nav v-if="this.$store.state.userId">
    | <router-link to="/home">Home</router-link> |
      <router-link to = "/history">Historial</router-link> |
      <router-link to = "/actualState">Estado Actual</router-link> | 
      <router-link to = "/investment">Analisis de Inversiones</router-link> |
  </nav>
  <router-view/>
</template>

<script>
export default{
    data(){
      return{
        userId: ''
      }
    }
}

</script>


<style >
#app {
  font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

}
nav a {
  font-weight: bold;
  color: #8a9197;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>