<template>
    <head>
      <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/2.6.0/uicons-thin-straight/css/uicons-thin-straight.css'>
    </head>
     <h1>Bienvenido a La Billetera Virtual </h1>
     <h1></h1>
    <div class="princ-container">
     
      <div class="sec-container">
           
            <i class="fi fi-ts-rocket-lunch"></i>
            <h2>E-Crypto</h2>
            <div class="container">
              <form>
                  <h3>Ingresar ID</h3>
                  <input type="text" v-model="userId" required />
                  <div v-if="error"></div>
                  <p>{{ error }}</p>
                  <button @click.prevent="Login">Iniciar Seción</button>
              </form>
            </div>
        </div>
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
  .princ-container{
    display: grid;
    justify-content: center;
    
    
  }
  .sec-container{
    background-color: rgb(255, 255, 255);
    padding: 50px 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 600px;
  
  }
  i{
    size: 30px;
  }
  
  h1{
    font-size: 35px;
    color: rgb(49, 186, 186);
  
    border-radius: 10px;
    
  }
  h3{
    font-size: 15px;
    color: rgb(96, 95, 95)
    
  }
  input{
    margin: 5px 0;
    padding: 8px 100px;
    width: 60%;
    box-sizing: border-box;
    border-radius: 10px;
  }
  button{
    margin: 5px 0;
    padding: 8px;
    width: 60%;
    border: none;
    border-radius: 10px;
    background: rgb(4,78,83);
    background: linear-gradient(90deg, rgba(4,78,83,1) 0%, rgba(9,103,121,1) 48%, rgba(0,203,246,1) 100%);
    color: aliceblue;
  }
  </style> 