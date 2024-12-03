import axios from "axios";

const apiClient = axios.create({
    // baseURL:' https://labor3-d60e.restdb.io/rest/' ,
    // headers: {'x-apikey': '64a2e9bc86d8c525a3ed8f63' }
     baseURL: ' https://laboratorio-36cf.restdb.io/rest',
    headers:{'X-APIKEY': '64a5ccf686d8c5d256ed8fce'}        

});

export default{
  
   getAllTransactions(userId){
    return apiClient.get(`/transactions?q={"user_id": "${userId}"}`);
   },
   newTransaction(transaction){
    return apiClient.post(`/transactions`, transaction);
   },
   updateTransaction(id, update){
    return apiClient.patch(`/transactions/${id}`, update);
   },
   deleteTransaction(id) {
    return apiClient.delete(`/transactions/${id}`);
  }

}