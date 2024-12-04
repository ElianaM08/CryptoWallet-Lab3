<!-- <template>
  <div class="edit-transaction-container">
    <h2>Editar Transacción</h2>
    <form @submit.prevent="saveTransaction" class="edit-form">
      <div class="form-group">
        <label for="crypto_code">Criptomoneda</label>
        <select v-model="transaction.crypto_code" id="crypto_code" required>
          <option value="BTC">Bitcoin (BTC)</option>
          <option value="ETH">Ethereum (ETH)</option>
          <option value="USDC">USD Coin (USDC)</option>
        </select>
      </div>
      <div class="form-group">
        <label for="crypto_amount">Cantidad</label>
        <input
          type="number"
          id="crypto_amount"
          v-model.number="transaction.crypto_amount"
          required
          min="1"
        />
      </div>
      <div class="form-group">
        <label for="money">Dinero</label>
        <input
          type="number"
          id="money"
          v-model.number="transaction.money"
          required
          min="1"
        />
      </div>
      <div class="form-group">
        <label for="action">Acción</label>
        <select v-model="transaction.action" id="action" required>
          <option value="purchase">Compra</option>
          <option value="sale">Venta</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-save">Guardar</button>
        <button @click="cancelEdit" type="button" class="btn btn-cancel">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import LaboratorioApi from "@/services/LaboratorioApi";

export default {
  name: "EditTransaction",
  props: ["transactionId"],
  data() {
    return {
      transaction: {
        crypto_code: "",
        crypto_amount: 0,
        money: 0,
        action: "",
      },
    };
  },
  methods: {
    async fetchTransaction() {
      try {
        const response = await LaboratorioApi.getAllTransactions(this.userId);
        const transaction = response.data.find((t) => t._id === this.id);
        if (transaction) {
          this.transaction = { ...transaction };
         } else {
          alert("Transacción no encontrada.");
           this.$router.push({ name: "HistoryView" });
        }
      } catch (error) {
        console.error("Error al cargar la transacción:", error);
        alert("No se pudo cargar la transacción.");
      }
    },
    async saveTransaction() {
      try {
        await LaboratorioApi.updateTransaction(this._id, this.transaction);
        alert("Transacción actualizada con éxito.");
        this.$router.push({ name: "HistoryView" });
      } catch (error) {
        console.error("Error al guardar la transacción:", error);
        alert("No se pudo actualizar la transacción.");
      }
    },
    cancelEdit() {
      this.$router.push({ name: "HistoryView" });
    },
  },
  created() {
    this.fetchTransaction();
  },
};
</script> -->

<template>
  <div class="edit-transaction-container">
    <h2 class="title">Editar Transacción</h2>
    <form @submit.prevent="updateTransaction" class="form-container">
      <div class="form-group">
        <label for="crypto_code" class="form-label">Criptomoneda:</label>
        <select
          id="crypto_code"
          v-model="transaction.crypto_code"
          @change="updateMoney"
          class="form-input"
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <div class="form-group">
        <label for="crypto_amount" class="form-label">Cantidad:</label>
        <input
          id="crypto_amount"
          type="number"
          v-model.number="transaction.crypto_amount"
          @input="updateMoney"
          min="1"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="action" class="form-label">Acción:</label>
        <select
          id="action"
          v-model="transaction.action"
          class="form-input"
        >
          <option value="purchase">Compra</option>
          <option value="sale">Venta</option>
        </select>
      </div>
      <div class="form-group">
        <label for="money" class="form-label">Monto:</label>
        <input
          id="money"
          type="text"
          v-model="transaction.money"
          readonly
          class="form-input readonly-input"
        />
      </div>

      <div class="button-container">
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import LaboratorioApi from "@/services/LaboratorioApi";
import CryptoYaApi from "@/services/CryptoYaApi";

export default {
  name: "EditTransaction",
  props: ["transactionId"],
  data() {
    return {
      transaction: {
        crypto_code: "",
        crypto_amount: 0,
        money: 0,
        action: "purchase",
      },
    };
  },
  methods: {
    async fetchTransaction() {
      try {
        const response = await LaboratorioApi.getAllTransactions(this.userId);
        const transaction = response.data.find((t) => t._id === this.id);
        if (transaction) {
          this.transaction = { ...transaction };
          this.updateMoney();
        } else {
          alert("Transacción no encontrada.");
          this.$router.push({ name: "HistoryView" });
        }
      } catch (error) {
        console.error("Error al cargar la transacción:", error);
      }
    },
    async updateMoney() {
      if (this.transaction.crypto_code && this.transaction.crypto_amount > 0) {
        try {
          const response = await CryptoYaApi.getPrice(
            this.transaction.crypto_code,
            this.transaction.crypto_amount
          );
          this.transaction.money =
            this.transaction.action === "purchase"
              ? response.data.totalAsk
              : response.data.totalBid;
        } catch (error) {
          console.error("Error al obtener el precio de la criptomoneda:", error);
        }
      }
    },
    async updateTransaction() {
      try {
        await LaboratorioApi.updateTransaction(this._id, this.transaction);
        alert("Transacción actualizada.");
        this.$router.push({ name: "HistoryView" });
      } catch (error) {
        console.error("Error al actualizar la transacción:", error);
      }
    },
    cancelEdit() {
      this.$router.push({ name: "HistoryView" });
    },
  },
  created() {
    this.fetchTransaction();
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    },
  },
};
</script>

<style scoped>
.edit-transaction-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: bold;
  margin-bottom: 8px;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.readonly-input {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.button-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>

