<template>
    <div>
      <h2>Editar Transacción</h2>
      <form @submit.prevent="updateTransaction">
        <div>
          <label for="action">Acción</label>
          <select v-model="transaction.action" id="action" required>
            <option value="purchase">Compra</option>
            <option value="sale">Venta</option>
          </select>
        </div>
        
        <div>
          <label for="cryptoType">Criptomoneda</label>
          <select v-model="transaction.cryptoType" id="cryptoType" required>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
          </select>
        </div>
  
        <div>
          <label for="cryptoAmount">Cantidad</label>
          <input type="number" v-model="transaction.cryptoAmount" id="cryptoAmount" min="0.01" required />
        </div>
  
        <div>
          <label for="money">Monto Total</label>
          <input type="number" v-model="transaction.money" id="money" min="0.01" required />
        </div>
  
        <div>
          <button type="submit">Guardar Cambios</button>
          <button @click="goBack">Cancelar</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: "EditTransactions",
    data() {
      return {
        transaction: {
          action: "",
          cryptoType: "",
          cryptoAmount: 0,
          money: 0,
        },
      };
    },
    methods: {
      async fetchTransaction() {
        try {
          const transactionId = this.$route.params.id; 
          const response = await this.$store.dispatch("fetchTransactions", transactionId); 
          if (response) {
            this.transaction = { ...response };
          }
        } catch (error) {
          console.error("Error al obtener la transacción:", error);
        }
      },
  
      async updateTransaction() {
        try {
          const transactionId = this.$route.params.id;
          await this.$store.dispatch(" UPDATE_TRANSACTION", {
            id: transactionId,
            update: this.transaction,
          });
  
          this.$router.push({ name: "HistoryView" });
        } catch (error) {
          console.error("Error al actualizar la transacción:", error);
        }
      },
  
      goBack() {
        this.$router.push({ name: "HistoryView" });
      },
    },
    created() {
      this.fetchTransaction(); 
    },
  };
  </script>