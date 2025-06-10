<template>
    <head>
      <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.6.0/uicons-thin-straight/css/uicons-thin-straight.css'>
    </head>
    <div class="princ-container">
      <main class="main">
              <form>
                  <i class="fi fi-ts-rocket-lunch"> E-Crypto</i>
                  <h2>Sign up</h2>
                  <h3>Bienvenido a la billetera virtual que puede cambiar tu futuro</h3>
                  <p>Ingresar ID</p>
                  <input type="text" v-model="userId" required />
                  <div v-if="error"></div>
                  <p>{{ error }}</p>
                  <button @click.prevent="Login">Login</button>
              </form>    
      </main>
      <img class="image-section" src="../assets/trading.png" alt="">
    </div>
      
  </template>
  <script>
  
  export default{
    name: "LoginView",
    data(){
        return{
            userId: ' ',
            error: ' ',
        };
    },
    methods: {
        Login(){
            if(!this.userId){
              this.error = 'Debe ingresar un ID para continuar';
            }else{
                this.$store.commit('SetUserId', this.userId);
                this.$router.push({  path: "/home" });
            }
        }
    }
  
  }
</script>
<style scoped>
 body {
  height: 100%;
  width: 100%;
}
.princ-container{
    display: flex;
    height: 100vh;
    
}
.main .image-section{
    flex: 1;
}
.main{
    background-color: rgb(0, 0, 0);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 200px;
 }
 
 .image-section{
    background-size: cover;
    background-position: center;
 }
 h2{
  color: aliceblue;
 }

  i{
    size: 30px;
    color: aliceblue;
  }
  h3{
    font-size: 12px;
    color: aliceblue;
    margin-bottom: 40px;
  }
  p{
    font-size: 10px;
   color: rgb(215, 216, 217);
    
  }
  input{
    padding:15px 100px;
    box-sizing: border-box;
    border-radius: 3px;
    background-color: rgb(54, 54, 57);
    border: none;
  }
  button{
  margin: 5px 0;
  padding: 15px 165px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
  }
</style> 