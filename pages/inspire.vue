<template>
  <v-layout>
    <v-flex text-xs-center>
      <text-changer :id="'text-changer'" />
    </v-flex>
  </v-layout>
</template>

<script>
import TextChanger from '../components/TextChanger'
export default {
  components: {
    'text-changer': TextChanger
  }
}
</script>
