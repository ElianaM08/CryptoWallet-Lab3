import axios from 'axios';

const cliente = axios.create({
    baseURL: "https://criptoya.com",
    withCredentials: false,
});


export default {
  getPrice(coin, volumen){
    return cliente.get(`/api/binance/${coin}/ars/${volumen}`);
  } 
};