<template>
    <div class="calculate-actions-container">
      <h2>Resumen</h2>
      <table>
        <thead>
          <tr>
            <th>Acción</th>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Monto Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(action, index) in actions" :key="index">
            <td>{{ action.action }}</td>
            <td>{{ action.cryptoType }}</td>
            <td>{{ action.cryptoAmount }}</td>
            <td>{{ action.money }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
<script>
  export default {
    name: "CalculateActions",
    data() {
      return {
        actions: [],
      };
    },
    methods: {
      async fetchActions() {
        try {
          await this.$store.dispatch("fetchTransactions");
          const transactions = this.$store.state.transactions;
  
          this.actions = transactions.map((transaction) => ({
            action: transaction.action === "purchase" ? "Compra" : "Venta",
            cryptoType: transaction.crypto_code,
            cryptoAmount: transaction.crypto_amount,
            money: transaction.money,
          }));
        } catch (error) {
          console.error("Error al obtener las acciones:", error);
        }
      },
    },
    async created() {
      await this.fetchActions();
    },
  };
</script>
  
<style scoped>
    .calculate-actions-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      text-align: center;
    }
    
  </style>
    