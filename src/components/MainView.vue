<script setup>
import { NormalWorkTimeLimit, ExtendedWorkTimeLimit } from './../interfex/Constants'

</script>

<template>

  <h1>Pünktlich Feierabend</h1>
  <div class="info">
    <h4>Arbeitszeitregeln:</h4>
    <ul>
      <li>Nur ausgeloggte Pausenzeiten >15 Minuten sind relevant</li>
      <li>Nach {{ NormalWorkTimeLimit.totalHours().toFixed(2) }} h wird 1/2 Std. abgezogen.</li>
      <li>Nach {{ ExtendedWorkTimeLimit.totalHours().toFixed(2) }} h eine weitere 1/4 Stunde.</li>
    </ul>

  </div>
</template>

<style scoped>
.info {
  text-align: left;
}
a {
  color: #42b983;
}

ul {
  list-style-type: square;
}

</style>
