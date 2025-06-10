<template>
    <div class="sale-container">
      <h2>Venta</h2>
      <form @submit.prevent="handleSale">
        <div>
          <label for="cryptoType">Selecciona una criptomoneda:</label>
          <select id="cryptoType"v-model="cryptoType">
            <option value="" disabled></option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="USDC">USD Coin (USDC)</option>
          </select>
        </div>
  
        <div>
          <label for="amount">Cantidad:</label>
          <input
            type="number"
            id="amount"
            v-model.number="amount"
            min="1"
          />
          <p v-if="error">{{ error }}</p>
        </div>
  
        <div>
          <p>Precio de la venta:</p>
          <ul>
            <li><strong>Sin comision:</strong> {{ cryptoPrice.bid }}</li>
            <li><strong>Con comision:</strong> {{ cryptoPrice.totalBid }}</li>
          </ul>
        </div>
        <div class="button">
           <button type="submit":disabled="isLoading">
             {{ isLoading ? "Procesando..." : "Vender" }}
          </button>
        </div>
       
      </form>
    </div>
  </template>
  
  <script>
  import CryptoYaApi from "@/services/CryptoYaApi";
  import LaboratorioApi from "@/services/LaboratorioApi";
  
  export default {
    name: "Sale",
    data() {
      return {
        cryptoType: "",
        amount: null,
        cryptoPrice: {
          bid: 0,
          totalBid: 0,
        },
        error: "",
        isLoading: false,
      };
    },
    methods: {
      async handleSale() {
        this.error = "";
        if (!this.cryptoType || this.amount <= 0) {
          this.error = "Selecciona una criptomoneda y una cantidad válida mayor a 0.";
          return;
        }
  
        this.isLoading = true;
  
        try {
          const priceResponse = await CryptoYaApi.getPrice(this.cryptoType, this.amount);
          const { bid, totalBid } = priceResponse.data;
  
          this.cryptoPrice = { bid, totalBid };
  
          const transaction = {
            user_id: this.$store.state.userId, 
            action: "sale",
            crypto_code: this.cryptoType,
            crypto_amount: this.amount,
            money: totalBid,
            datetime:this.formatDate,
          };
  
          await LaboratorioApi.newTransaction(transaction);
       
          this.cryptoType = "";
          this.amount = null;
          this.$store.dispatch("fetchTransactions");
          alert("Venta realizada con éxito.");
        } catch (error) {
          console.error("Error al procesar la venta:", error);
          this.error = "Ocurrió un error al realizar la venta. Inténtalo nuevamente.";
        } finally {
          this.isLoading = false;
        }
      },
    },
    computed:{
        formatDate() {
          const dateTime = new Date();
          const dd = String(dateTime.getDate()).padStart(2, "0");
          const mm = String(dateTime.getMonth() + 1).padStart(2, "0");
          const yyyy = dateTime.getFullYear();
    
          const formattedDateTime = `${dd}-${mm}-${yyyy}`;
    
          return formattedDateTime;
        }
      }
  };
  </script>
    
    <style scoped>
    .sale-container {
      display: flex;
      flex-direction: column;
      max-width: 400px;
      margin: 0 auto;
      background-color: #171717;
      color: aliceblue;
      border-radius: 8px;
      padding: 50px 40px;
    }
    h2{
      text-align: center;
    }
    
    input,
    select {
      margin: 5px 0;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
    }
    ul{
      list-style: none;
    }
    .button{
      text-align: center;
    }
    button {
      margin-top: 20px;
      background-color: #f44336;
      color: white;
      border: none;
      cursor: pointer;
      padding: 10px 80px;
      border-radius: 3px;
    }
    
    button:hover {
      background-color: #e53935;
    }
    
    .error {
      color: red;
      font-size: 12px;
    }
    
    .success {
      color: green;
      font-size: 14px;
      margin-top: 10px;
    }
    </style>
    