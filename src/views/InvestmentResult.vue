<template>
    <div class="princ-container">
      <h2>Resultado de Inversiones</h2>
      <div class="container">
        <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(investment, index) in investmentResults" :key="index">
            <td>{{ investment.cryptoType }}</td>
            <td>
              {{ investment.result > 0 ? 'Ganancia' : 'Pérdida' }} 
              ({{ investment.result }})
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(investment, index) in investmentResults" :key="index">
            <td>{{ investment.cryptoType }}</td>
            <td>
              {{ investment.result > 0 ? 'Ganancia' : 'Pérdida' }} 
              ({{ investment.result }})
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import CryptoYaApi from '@/services/CryptoYaApi';
  
  export default {
    name: "InvestmentResult",
    data() {
      return {
        transactions: [],
        investmentResults: [],
      };
    },
    methods: {
      async fetchTransactions() {
        try {
          await this.$store.dispatch("fetchTransactions");
          this.transactions = this.$store.state.transactions;
          this.calculateInvestmentResults();
        } catch (error) {
          console.error("Error al obtener las transacciones:", error);
        }
      },
      async calculateInvestmentResults() {
        const investmentMap = {};
  
        this.transactions.forEach((transaction) => {
          const { crypto_code, crypto_amount, action, money } = transaction;
          if (!investmentMap[crypto_code]) {
            investmentMap[crypto_code] = { amount: 0, invested: 0 };
          }
  
          if (action === "purchase") {
            investmentMap[crypto_code].amount += crypto_amount;
            investmentMap[crypto_code].invested += money;
          } else if (action === "sale") {
            investmentMap[crypto_code].amount -= crypto_amount;
            investmentMap[crypto_code].invested -= money;
          }
        });
  
        const results = [];
        for (const cryptoType in investmentMap) {
          const { amount, invested } = investmentMap[cryptoType];
          if (amount > 0) {
            try {
              const response = await CryptoYaApi.getPrice(cryptoType, amount);
              const currentMoney = response.data.totalBid || 0; 
              const result = currentMoney - invested;
              results.push({ cryptoType, result });
            } catch (error) {
              console.error(`Error al obtener el precio de ${cryptoType}:`, error);
              results.push({ cryptoType, result: "Error al calcular" });
            }
          }
        }
  
        this.investmentResults = results;
      },
    },
    async created() {
      await this.fetchTransactions();
    },
  };
  </script>
  
    
  <style scoped>
    .princ-container{
      display: grid;
      justify-content: center;
    }
    .container {
      max-width: 500px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 100px;
    }
    h1{
      color: aliceblue;
    }
    th{
      color: black;
    }
  </style>
    