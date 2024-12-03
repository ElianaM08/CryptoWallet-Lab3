import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import HistoryView from '@/views/HistoryView.vue'
import EditTransaction from '@/components/EditTransaction.vue'
import ActualState from '@/views/ActualState.vue'
import InvestmentResult from '@/views/InvestmentResult.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/Home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/history',
    name: 'HistoryView',
    component: HistoryView
  },
  {
    path: '/edit-transaction/:id', 
    name: 'EditTransaction',
    component: EditTransaction,
    props: true 
  },
  {
    path: '/actualState',
    name: 'ActualState',
    component: ActualState
  },
  {
    path: '/investment',
    name: 'InvestmentResult',
    component: InvestmentResult
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
