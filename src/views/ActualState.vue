 <!-- <template>
    <div class="princ-container">
      <h2>Estado Actual</h2>
      <div class="container">
          <table>
          <thead>
            <tr>
              <th>Criptomoneda</th>
              <th>Cantidad</th>
              <th>Valor en Dinero</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(transaction, index) in transactions" :key="index">
              <td>{{ transaction.crypto_code }}</td>
              <td>{{ transaction.crypto_amount }}</td>
              <td>{{formatMoney(transaction.money)  }}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <strong>Monto Total:</strong> {{ formatMoney(totalMoney ) }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import CryptoYaApi from '@/services/CryptoYaApi';
  
  export default {
    name: "ActualState",
    data() {
      return {
        transactions: [],
        cryptoState: [],
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
          this.transactions = this.$store.state.transactions;
          this.calculateCryptoState();
        } catch (error) {
          console.error("Error al obtener las transacciones:", error);
        }
      },
      async calculateCryptoState() {
        const cryptoMap = {};
        this.transactions.forEach((transaction) => {
          const { crypto_code, crypto_amount, action } = transaction;
          if (!cryptoMap[crypto_code]) {
            cryptoMap[crypto_code] = 0;
          }
      
          cryptoMap[crypto_code] += action === "purchase" ? crypto_amount : -crypto_amount;
        });
  
        const cryptoState = [];
        for (const cryptoType in cryptoMap) {
          const amount = cryptoMap[cryptoType];
          if (amount > 0) {
            try {
              const response = await CryptoYaApi.getPrice(cryptoType, amount);
              const money = response.data.totalBid || 0; 
              cryptoState.push({ cryptoType, amount, money });
            } catch (error) {
              console.error(`Error al obtener el precio de ${cryptoType}:`, error);
              cryptoState.push({ cryptoType, amount, money: 0 });
            }
          }
        }
  
        this.cryptoState = cryptoState;
        this.totalMoney = this.calculateTotalMoney;
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
  </script>    -->
  <template>
    <div class="container">
      <h2>Estado Actual de Finanzas</h2>
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Valor en Dinero</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(crypto, index) in transactions" :key="index">
            <td>{{ crypto.crypto_code }}</td>
            <td>{{ crypto.crypto_amount }}</td>
            <td>{{ formatMoney(crypto.money) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="total">
        <strong>Monto Total:</strong> {{ formatMoney(totalMoney) }}
      </div>
    </div>
  </template>
  
  <script>
  import LaboratorioApi from "@/services/LaboratorioApi";
  
  export default {
    name: "ActualState",
    data() {
      return {
        transactions: [],
        totalMoney: 0, 
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
          this.transactions = response.data;
          this.calculateCryptoState();
        } catch (error) {
          console.error("Error al obtener las transacciones:", error);
        }
      },
      calculateCryptoState() {
        const cryptoMap = {};
  
        // Procesar las transacciones
        this.transactions.forEach((transaction) => {
          const { crypto_code, crypto_amount, money, action } = transaction;
  
          if (!cryptoMap[crypto_code]) {
            cryptoMap[crypto_code] = { totalAmount: 0, totalMoney: 0 };
          }
  
          if (action === "purchase") {
            cryptoMap[crypto_code].totalAmount += crypto_amount;
            cryptoMap[crypto_code].totalMoney += money;
          } else if (action === "sale") {
            cryptoMap[crypto_code].totalAmount -= crypto_amount;
            cryptoMap[crypto_code].totalMoney -= money;
          }
        });
        const transactions = [];
        let totalMoney = 0;
        for (const crypto_code in cryptoMap) {
          const { totalAmount, totalMoney: money } = cryptoMap[crypto_code];
          if (totalAmount > 0) {
           transactions.push({ crypto_code, amount: totalAmount, totalMoney });
            totalMoney += money;
          }
        }
  
        transactions = transactions;
        this.totalMoney = totalMoney;
      },
      formatMoney(value) {
        return new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(value);
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
    table{
    
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    h2{
      color: aliceblue;
    }
    th , td{
      background-color: aliceblue;
    }
    .total{
      color: aliceblue;
    }
  </style>
    