<template>
    <div>
      <h2>Historial de Transacciones</h2>
      <table border="1" class="table">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Dinero</th>
            <th>Acción</th>
            <th>Fecha y Hora</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="transaction in transactions"
            :key="transaction.id"
            @click="selectTransaction(transaction)"
            :class="{ selected: selectedTransaction?.id === transaction.id }"
          >
            <td>{{ transaction.user_id }}</td>
            <td>{{ transaction.crypto_code }}</td>
            <td>{{ transaction.crypto_amount }}</td>
            <td>{{ transaction.money }}</td>
            <td>{{ transaction.action }}</td>
            <td>{{ transaction.datetime }}</td>
            <td>
              <button @click.stop="deleteTransaction(transaction._id)">Eliminar</button>
              <button @click.stop="redirectToEdit(transaction.id)">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="transactions.length === 0">No hay transacciones disponibles.</div>
    </div>
  </template>
  
  <script>
  import LaboratorioApi from "@/services/LaboratorioApi"; 
  
  export default {
    data() {
      return {
        transactions: [], 
        selectedTransaction: null, 
        index: 0,
      };
    },
    methods: {
      async fetchTransactions() {
        try {
          const userId = this.$store.state.userId; 
          const response = await LaboratorioApi.getAllTransactions(userId);
          this.transactions = response.data;
        } catch (error) {
          console.error("Error al obtener las transacciones:", error);
        }
      },
      selectTransaction(transaction) {
        this.selectedTransaction = transaction; 
      },
      async deleteTransaction(transactionId) {
       try {
      await LaboratorioApi.deleteTransaction(transactionId);
      this.transactions = this.transactions.filter(
        (transaction) => transaction._id !== transactionId
      );
      alert("Transacción eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar la transacción:", error);
      alert("No se pudo eliminar la transacción.");
    }
  },
  
      redirectToEdit(Id) {
        this.$router.push({ name: "EditTransaction", params: { id: Id } });
      },
    },
    created() {
      this.fetchTransactions(); 
    },
  };
  </script>
  
  <style scoped>
  .selected {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  
  h2{
    color: aliceblue;
  }
  
  .table{
    background-color: aliceblue;
  }
  
  .deleteButton{
    margin: 5px 0;
    padding: 8px;
    width: 60%;
    border: none;
    border-radius: 10px;
    background: rgb(187, 10, 10);
    background: linear-gradient(90deg, rgb(187, 10, 10) 0%, rgb(176, 58, 58) 48%, rgb(143, 65, 65) 100%);
    color: aliceblue;
  }
  .editButton{
    margin: 5px 0;
    padding: 8px;
    width: 60%;
    border: none;
    border-radius: 10px;
    background: rgb(4,78,83);
    background: linear-gradient(90deg, rgba(4,78,83,1) 0%, rgba(9,103,121,1) 48%, rgba(0,203,246,1) 100%);
    color: aliceblue;
  }
  </style>