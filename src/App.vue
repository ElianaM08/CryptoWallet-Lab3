<template>
  <head>
    <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.6.0/uicons-thin-straight/css/uicons-thin-straight.css'>
  </head>
  <div class="app-container">
    <nav v-if="this.$store.state.userId">
      
        <i class="fi fi-ts-rocket-lunch"> E-Crypto</i>
        <router-link class="router-link" to="/home">Home</router-link> 
        <router-link  class="router-link" to = "/history">Historial</router-link> 
        <router-link  class="router-link" to = "/actualState">Estado Actual</router-link> 
        <router-link  class="router-link" to = "/investment">Analisis de Inversiones</router-link> 
      
    </nav>
  <main class="main-content">
      <router-view /> <!-- Acá se mostrará Home.vue -->
  </main>
  </div>


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
body{
  background-color: black;
}
i{
  color: aliceblue;
}
.app-container {
  display: flex;
  height: 100vh;
}
nav{
   width: 200px;
  background-color: #333;
  color: white;
  padding: 20px;
  border-radius: 5px;
}
.main-content {
  flex: 1;
  padding: 20px;
}

nav a {
  font-weight: bold;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  display: block;
}
nav a.router-link{
  margin-top: 20px;
  margin-bottom: 20px;
}
nav a.router-link-exact-active {
  color: #429fb9;
}
</style>