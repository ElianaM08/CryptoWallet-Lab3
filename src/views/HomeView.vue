<template>
  <div class="container">
      <PurchaseComponent class="purchase"></PurchaseComponent>
      <CalculateActions class="calculate"></CalculateActions>
      <SaleComponent class="sale"></SaleComponent>
      
  </div>
</template>

<script>
import CalculateActions from '@/components/CalculateActions.vue';
import PurchaseComponent from '@/components/PurchaseComponent.vue';
import SaleComponent from '@/components/SaleComponent.vue';

export default {
  name: 'HomeView',
  props:{
    userId: {
      type: String,
      Required: true,
    }
  },
  components: {
    PurchaseComponent,
    SaleComponent,
    CalculateActions,
  }
}
</script>
<style scoped>
.container{
  display: flex;
  gap: 20px;
}


</style>