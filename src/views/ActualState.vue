 <template>
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
  </script> 
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
            <tr v-for="(crypto, index) in cryptoState" :key="index">
              <td>{{ crypto.cryptoType }}</td>
              <td>{{ crypto.amount }}</td>
              <td>{{ crypto.money }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    
      <div>
        <strong>Monto Total:</strong> {{ totalMoney }}
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
        return this.cryptoState.reduce((total, crypto) => total + crypto.money, 0);
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
    },
    async created() {
      await this.fetchTransactions();
    },
  };
  </script> -->
  
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
    h2{
      color: aliceblue;
    }
    th{
      color: black;
    }
  
  </style>
    