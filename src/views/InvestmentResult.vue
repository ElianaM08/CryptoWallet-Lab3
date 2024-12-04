<!-- <template>
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
          <tr v-for="(transaction, index) in transactions" :key="index">
            <td>{{ transaction.crypto_code }}</td>
            <td>
              {{ calculateResult( transaction.money) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import CryptoYaApi from "@/services/CryptoYaApi";

export default {
  name: "InvestmentResult",
  data() {
    return {
      transactions: [],
    };
  },
  methods: {
    // Método para calcular el resultado (ganancia o pérdida)
    calculateResult(money) {
      const currentPrice = this.getCurrentPrice( money);

      // Si la transacción es una compra, se calcula la diferencia
      if (money > currentPrice) {
        const profit = currentPrice - money;
        return `Ganancia: ${profit.toFixed(2)} ARS`;
      } else {
        const loss = money- currentPrice;
        return `Pérdida: ${loss.toFixed(2)} ARS`;
      }
    },

    // Método para obtener el precio actual de la criptomoneda
    async getCurrentPrice( money) {
      try {
        const response = await CryptoYaApi.getPrice( money);
        return response.data.totalBid || 0;  // El precio de la criptomoneda
      } catch (error) {
        console.error("Error al obtener el precio de la criptomoneda:", error);
        return 0;
      }
    },

    // Fetch las transacciones (suponiendo que ya tienes un store que las maneja)
    async fetchTransactions() {
      try {
        await this.$store.dispatch("fetchTransactions");
        this.transactions = this.$store.state.transactions;
      } catch (error) {
        console.error("Error al obtener las transacciones:", error);
      }
    },
  },
  async created() {
    await this.fetchTransactions();
  },
};
</script> -->
<!-- <template>
  <div class="investment-result-container">
    <h2>Resultado de Inversiones</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Valor Total de Compra/Venta</th>
            <th>Ganancia/Pérdida</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in transactions" :key="index">
            <td>{{ transaction.crypto_code }}</td>
            <td>{{ transaction.crypto_amount }}</td>
            <td>{{ formatMoney(transaction.money) }}</td>
            <td>{{ formatMoney(transaction.profitOrLoss) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="total">
      <strong>Monto Total:</strong> {{ formatMoney(totalMoney) }}
    </div>
  </div>
</template>

<script>
import CryptoYaApi from "@/services/CryptoYaApi";

export default {
  name: "InvestmentResult",
  data() {
    return {
      transactions: [],
      totalMoney: 0,
    };
  },
  computed: {
    calculateTotalMoney() {
      return this.transactions.reduce((total, transaction) => total + transaction.money, 0);
    },
  },
  methods: {
    async fetchTransactions() {
      try {
        await this.$store.dispatch("fetchTransactions");
        this.transactions = this.$store.state.transactions.filter(transaction =>
          transaction.action === "purchase" || transaction.action === "sale"
        );
        await this.calculateProfitOrLossForAllTransactions();
        this.totalMoney = this.calculateTotalMoney;
      } catch (error) {
        console.error("Error al obtener las transacciones:", error);
      }
    },

    async calculateProfitOrLossForAllTransactions() {
      const updatedTransactions = [];

      for (const transaction of this.transactions) {
        const currentPrice = await this.getCurrentPrice(transaction.crypto_code);
        let profitOrLoss = 0;

        if (transaction.action === "purchase") {
          profitOrLoss = (currentPrice * transaction.crypto_amount) - transaction.money;
        }
        else if (transaction.action === "sale") {
          profitOrLoss = transaction.money - (currentPrice * transaction.crypto_amount);
        }

        updatedTransactions.push({
          ...transaction,
          profitOrLoss,
        });
      }

      this.transactions = updatedTransactions;
    },

    async getCurrentPrice(cryptoCode) {
      try {
        const response = await CryptoYaApi.getPrice(cryptoCode);
        return response.data.totalBid || 0; 
      } catch (error) {
        console.error("Error al obtener el precio de la criptomoneda:", error);
        return 0; 
      }
    },

    formatMoney(value) {
      const number = Number(value);
      if (isNaN(number)) {
        return value; 
      }
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(number); 
    },
  },
  async created() {
    await this.fetchTransactions();
  },
};
</script> -->
<template>
  <div>
    <h2>Resultados de Inversión</h2>
    <table>
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index">
          <td>{{ transaction.crypto_code }}</td>
          <td :class="{'profit': transaction.profitOrLoss > 0, 'loss': transaction.profitOrLoss < 0}">
            {{ formatMoney(transaction.profitOrLoss) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import CryptoYaApi from "@/services/CryptoYaApi";

export default {
  name: "InvestmentResult",
  data() {
    return {
      transactions: [],
      cryptoResults: [],
    };
  },
  methods: {
    async fetchTransactions() {
      try {
        await this.$store.dispatch("fetchTransactions");
        this.transactions = this.$store.state.transactions.filter(
          (transaction) =>
            transaction.action === "purchase" || transaction.action === "sale"
        );
        await this.calculateCryptoResults();
      } catch (error) {
        console.error("Error al obtener las transacciones:", error);
      }
    },
    async calculateCryptoResults() {
      const cryptoMap = {};

      this.transactions.forEach((transaction) => {
        const { crypto_code, crypto_amount, money, action } = transaction;

        if (!cryptoMap[crypto_code]) {
          cryptoMap[crypto_code] = { totalAmount: 0, totalMoney: 0 };
        }

        if (action === "purchase") {
          cryptoMap[crypto_code].totalAmount += crypto_amount;
          cryptoMap[crypto_code].totalMoney -= money;
        } else if (action === "sale") {
          cryptoMap[crypto_code].totalAmount -= crypto_amount;
          cryptoMap[crypto_code].totalMoney += money;
        }
      });

      const transaction = [];
      for (const cryptoType in cryptoMap) {
        const { totalAmount, totalMoney } = cryptoMap[cryptoType];
        if (totalAmount !== 0) {
          try {
            const response = await CryptoYaApi.getPrice(cryptoType, Math.abs(totalAmount));
            const currentMoney = response.data.totalBid || 0;
            const profitOrLoss = totalMoney + currentMoney;
            transaction.push({
              cryptoType,
              profitOrLoss,
            });
          } catch (error) {
            console.error(`Error al obtener el precio de ${cryptoType}:`, error);
            transaction.push({
              cryptoType,
              profitOrLoss: totalMoney,
            });
          }
        }
      }

      this.transactions = transaction;
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
    await this.fetchTransactions();
  },
};
</script>

<style scoped>
table {
  display: grid;
  justify-content: center;
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

}
h2{
  color: aliceblue;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
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


<!-- <style scoped>
h2{
  color: aliceblue;
}
.investment-result-container {
  display: grid;
  justify-content: center;
  padding: 20px;
}

.table-container {
  margin-top: 20px;
  background-color: aliceblue;
}

table {
  width: 50%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

td {
  border-top: 1px solid #ddd;
  color: black;
}

.total {
  font-size: 1.2em;
  margin-top: 20px;
  display: block;
  background-color:rgb(49, 186, 186);
}
</style> -->

    
  <!-- <style scoped>
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
    h2{
      color: aliceblue;
    }
    th{
      color: black;
    }
  </style>
     -->