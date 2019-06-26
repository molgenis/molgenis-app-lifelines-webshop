<template>
  <div id="variable-view" class="container row">
    <div class="col-12" >
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link active" href="#">Variables</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Selection</a>
            </li>
        </ul>
        <div>
            Variables
        </div>
        <div>
            Selection
        </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'VariableView'
})
</script>
