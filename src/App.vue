<template>
  
  <nav v-if="this.$store.state.userId">
    | <router-link to="/home">Home</router-link> |
    <router-link to = "/history">Historial</router-link> |
    <router-link to = "/actualState">Estado Actual</router-link> | 
    <router-link to = "/investment">Analisis de Inversiones</router-link> |

  </nav>
 
  <router-view/>
</template>

<style>
#app {
  font-family:Arial, Helvetica, sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  text-align: center;
}
body{
  padding-top: 200px;
  background-color: #2c3e50;
  background-image: url('./assets/criptomoneda.jpg') ;
  background-repeat: no-repeat;
  background-size: cover;  
}
img{
  max-width: 500px;
 
}
nav a {
  font-weight: bold;
  color: #8a9197;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>