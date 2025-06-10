<template>
    <div class="container">
      <table border="1" class="table">
        <thead>
          <tr>
            <th>Usuario</th>
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
            <td>{{formatMoney(transaction.money)  }}</td>
            <td>{{ transaction.action }}</td>
            <td>{{ transaction.datetime }}</td>
            <td>
              <button @click.stop="deleteTransaction(transaction._id) " class="deleteButton">Eliminar</button>
              <button @click.stop="redirectToEdit(transaction._id)" class="editButton">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="transactions.length === 0" class="mj">No hay transacciones disponibles.</div>
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
    redirectToEdit(transactionId) {
      this.$router.push({ name: "EditTransaction", params: { id: transactionId} });
    },
 },
    created() {
      this.fetchTransactions(); 
    },
  };
</script>
  
<style scoped>
  .container{
    display: grid;
    justify-content: center;
    margin-top: 80px;
  }
  .table{
      background-color: #171717;
      color: aliceblue;
      width: 100%;
      border: none;
      
  }

  .table thead tr th,
  .table tbody tr td
  {
    border: none;
   
  }

  .selected {
      background-color: #171717;
      font-weight: bold;
      border: none;
  }
    
  h2{
      color: aliceblue;
  }
    

  .mj{
      color: aliceblue;
  }
  .deleteButton{
      margin: 5px 0;
      padding: 8px;
      width: 60%;
      border: none;
      border-radius: 3px;
      background: rgb(187, 10, 10);
      color: aliceblue;

  }
  .editButton{
      margin: 5px 0;
      padding: 8px;
      width: 60%;
      border: none;
      border-radius: 3px;
      background: rgb(4,78,83);
      color: aliceblue;
  }
</style>