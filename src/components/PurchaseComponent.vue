<template>
    <div class="purchase-container">
      <h2>Compra</h2>
      <form @submit.prevent="handlePurchase">
        <div>
          <label for="cryptoType">Selecciona una criptomoneda:</label>
          <select id="cryptoType" v-model="cryptoType">
            <option value="" disabled>Seleccionar...</option>
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
          <p >Precio de la compra:</p>
          <ul>
            <li><strong>Precio sin comision:</strong> {{ cryptoPrice.ask }}</li>
            <li><strong>Precio con comision:</strong> {{ cryptoPrice.totalAsk }}</li>
          </ul>
        </div>
  
        <button type="submit":disabled="isLoading">
          {{ isLoading ? "Procesando..." : "Comprar" }}
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import CryptoYaApi from "@/services/CryptoYaApi";
  import LaboratorioApi from "@/services/LaboratorioApi";
  
  export default {
    name: "Purchase",
    data() {
      return {
        cryptoType: "",
        amount: null,
        cryptoPrice: {
          ask: 0,
          totalAsk: 0,
        },
        error: "",
        isLoading: false,
      };
    },
    methods: {
      async handlePurchase() {
        this.error = "";
        if (!this.cryptoType || this.amount <= 0) {
          this.error = "Selecciona una criptomoneda y una cantidad válida mayor a 0.";
          return;
        }
  
        this.isLoading = true;
  
        try {
          const priceResponse = await CryptoYaApi.getPrice(this.cryptoType, this.amount);
          const { ask, totalAsk } = priceResponse.data;
  
          this.cryptoPrice = { ask, totalAsk };
  
          const transaction = {
            user_id: this.$store.state.userId, 
            action: "purchase",
            crypto_code: this.cryptoType,
            crypto_amount: this.amount,
            money: totalAsk,
            datetime:this.formatDate,
          };
  
          await LaboratorioApi.newTransaction(transaction);
          this.cryptoType = "";
          this.amount = null;
          this.$store.dispatch("fetchTransactions");
          alert("Compra realizada con éxito.");
  
        } catch (error) {
          console.error("Error al procesar la compra:", error);
          this.error = "Ocurrió un error al realizar la compra. Inténtalo nuevamente.";
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
    .purchase-container {
      display: flex;
      flex-direction: column;
      max-width: 400px;
      margin: 0 auto;
      justify-content: center;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 50px 40px; 
    }
    
    input,
    select {
      margin: 5px 0;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
    }
    
    button {
      margin-top: 20px;
      padding: 10px;
      background-color: #4caf50;
      color: white;
      border: none;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #45a049;
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
    