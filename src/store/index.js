import { createStore } from 'vuex'
import LaboratorioApi from '@/services/LaboratorioApi';
import CryptoYaApi from '@/services/CryptoYaApi';
export default createStore({
  state: {
    transactions: [],
    totalMoney: 0,
    userId: ''
  },
  getters: {
    allTransactions: state => state.transactions,
    totalMoney: state => state.totalMoney,
    getUser: state => state.userId,
  },
  mutations: {
    SetTransaction(state, transactions) {
      state.transactions = transactions;
    },
    AddTransaction(state, transaction) {
      state.transactions.push(transaction);
    },
    updatedTransaction(state, updatedTransaction) {
      const index = state.transactions.findIndex(t => t.id === updatedTransaction.id);
      if (index !== -1) {
        Vue.set(state.transactions, index, updatedTransaction);
      }
    },
    RemoveTransaction(state, userId) {
      state.userId = state.userId.filter(t => t.id !== userId);
     },
    SetTotalMoney(state, total) {
      state.totalMoney = total;
    },
    SetUserId(state, userId){
      state.userId = userId;
    },
  },
  actions: {
    async fetchTransactions({ commit, state }) {
      try {
        if (!state.userId) {
          throw new Error("El usuario no está autenticado.");
        }
        const response = await LaboratorioApi.getAllTransactions(state.userId);
        commit("SetTransaction", response.data);
      } catch (error) {
        console.error("Error al obtener las transacciones:", error);
      }
    },
  
    async saveTransaction({ commit }, transaction) {
      const response = await LaboratorioApi.newTransaction(transaction);
      commit('AddTransaction', response.data);
    },
    async calculateCurrentState({ commit, state }) {
      let total = 0;
      for (const transaction of state.transactions) {
        const { cryptoType, quantity, action } = transaction;
        const priceResponse = await CryptoYaApi.getPrice(cryptoType, quantity);
        const price = priceResponse.data.price;
        if (action === 'compra') {
          total += price;
        } else if (action === 'venta') {
          total -= price;
        }
      }
      commit('SetTotalMoney', total);
    },
    async getTransactions({ commit }, userId) {
      const response = await LaboratorioApi.getAllTransactions(userId);
      commit('SetTransaction', response.data);
    },
  },
  modules: {
  }
})
