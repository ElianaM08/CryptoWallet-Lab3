<template>
  <div class="container">
    <h2>Resultados de Inversión</h2>
    <table>
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in transactions" :key="index">
          <td>{{ result.crypto_code }}</td>
          <td :class="{'profit': result.profitOrLoss > 0, 'loss': result.profitOrLoss < 0}">
            {{ formatMoney(result.profitOrLoss) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import LaboratorioApi from "@/services/LaboratorioApi";
import CryptoYaApi from "@/services/CryptoYaApi";

export default {
  name: "InvestmentResult",
  data() {
    return {
      transactions: [], 
      cryptoResults: [], 
      userId: null, 
    };
  },
  methods: {
    async fetchTransactions() {
      try {
        if (!this.userId) {
          console.error("No se encontró el userId. Asegúrate de que el usuario esté autenticado.");
          return;
        }
        const response = await LaboratorioApi.getAllTransactions(this.userId);
        this.transactions = response.data.filter(
          (transaction) =>
            transaction.action === "purchase" || transaction.action === "sale"
        );
        await this.calculateCryptoResults();
      } catch (error) {
        console.error("Error al obtener las transacciones:", error);
      }
    },
    async calculateCryptoResults() {
      const cryptoMap = {
        BTC: { totalAmount: 0, totalMoney: 0 },
        ETH: { totalAmount: 0, totalMoney: 0 },
        USDC: { totalAmount: 0, totalMoney: 0 },
      };

      this.transactions.forEach((transaction) => {
        const { crypto_code, crypto_amount, money, action } = transaction;

        if (cryptoMap[crypto_code]) {
          if (action === "purchase") {
            cryptoMap[crypto_code].totalAmount += crypto_amount;
            cryptoMap[crypto_code].totalMoney -= money;
          } else if (action === "sale") {
            cryptoMap[crypto_code].totalAmount -= crypto_amount;
            cryptoMap[crypto_code].totalMoney += money;
          }
        }
      });

      const results = [];
      for (const crypto_code in cryptoMap) {
        const { totalAmount, totalMoney } = cryptoMap[crypto_code];
        let profitOrLoss = totalMoney;

        if (totalAmount !== 0) {
          try {
            const response = await CryptoYaApi.getPrice(crypto_code, Math.abs(totalAmount));
            const currentMoney = response.data.totalBid || 0;
            profitOrLoss += currentMoney; 
          } catch (error) {
            console.error(`Error al obtener el precio de ${crypto_code}:`, error);
          }
        }

        results.push({
          crypto_code,
          profitOrLoss,
        });
      }

      this.transactions = results;
    },
    formatMoney(value) {
      const formatted = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(Math.abs(value));
      return value > 0 ? `+${formatted}` : `-${formatted}`;
    },
  },
  async created() {
    this.userId = this.$store.state.userId || null;

    if (this.userId) {
      await this.fetchTransactions();
    } else {
      console.error("No se encontró el userId. No se pueden cargar las transacciones.");
    }
  },
};
</script>

<style scoped>
.container{
  display: grid;
  justify-content: center;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
h2{
  color: aliceblue;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  background-color: aliceblue;
}

th {
  background-color: #f4f4f4;
}

.profit {
  color: green;
}

.loss {
  color: red;
}
</style>


