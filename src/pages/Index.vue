<template>
  <div class="container">
    <q-page class="flex items-start justify-center">
     <!-- <img
        v-show="!pronostico.length"
        alt="Quasar logo"
        src="~assets/quasar-logo-full.svg"
      /> -->
      <div class="row">
        <div class="col col-xs-12 q-m-auto">
          <q-card>
            <q-card-section>
              <div class="text-h6 text-center text-light-blue-10">
                Buscar pronostico de clima con Api de Accuweather
              </div>
            </q-card-section>
            <q-separator inset />
            <div class="q-pa-md flex 
            flex-center"
             v-show="cargando">
              <q-circular-progress
                indeterminate
                size="50px"
                color="light-blue"
                class="q-ma-md"
              />
            </div>
            <q-card-section>
              <q-input
                rounded
                outlined
                v-model.trim="ciudad_buscar"
                @change="getCiudadkey"
                label="Ciudad"
              >
                <template v-slot:prepend>
                  <q-icon name="place" />
                </template>
              </q-input>
            </q-card-section>
            <q-separator inset />
            <p v-show="no_encontrado" class="text-brown-10 text-center text-h5">
              😑 Ciudad no encontrada
            </p>
            <div class="q-pa-md" 
            v-show="pronostico.length">
              <p>Pronostico de 12 horas</p>
              <table class="tablita">
                <thead>
                  <tr>
                    <th>Hora:</th>
                    <th>Descripcion:</th>
                    <th>Temp (C°):</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, index) in pronostico" :key="index">
                    <td class="text-center">{{ p.hora }}</td>
                    <td>{{ p.descripcion }}</td>
                    <td class="text-center">{{ p.temperatura }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "PageIndex",
  data() {
    return {
      cargando: false,
      ciudad_buscar: undefined,
      ciudad_key: undefined,
      no_encontrado: false,
      pronostico: []
    };
  },
  computed: {
    ...mapGetters(["getKey"])
  },
  methods: {
    async getCiudadkey() {
      this.pronostico = [];
      this.cargando = true;
      this.no_encontrado = false;
      this.ciudad_key = undefined;
      let ciudad = this.ciudad_buscar;
      //Usando forma de concatenacion normal:
      //let url_key_ciudad = 'http://dataservice.accuweather.com/locations/v1/cities/search?apikey='+this.getKey+'&q='+ciudad+'&language=es-es';
      let url_key_ciudad = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${this.getKey}&q=${ciudad}&language=es-es`;
      let req = await this.$axios.get(url_key_ciudad);
      let res = req.data;
      if (res.length) {
       /* 
      //Asi seria una forma de condicional
      //mas larga que usando el ternario
       if( res[0].Key)
        this.ciudad_key =  res[0].Key;
        else
        this.ciudad_key = undefined; 
        */
        this.ciudad_key = res[0].Key ? res[0].Key : undefined;
        console.log(this.ciudad_key);
      }
      if (!this.ciudad_key) {
        this.no_encontrado = true;
        this.cargando = false;
        return;
      }
      this.getPronostico();
    },
    async getPronostico() {
      let url_pronostico = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${this.ciudad_key}?apikey=${this.getKey}&language=es-es&metric=true`;
      let reqpronostico = await this.$axios.get(url_pronostico);
      let respronostico = reqpronostico.data;
      if (!respronostico.length) return;
      let datos_pronostico = [];
      respronostico.forEach(dato => {
        let hora = this.formatoHora(dato.EpochDateTime);
        datos_pronostico.push({
          hora: hora,
          descripcion: dato.IconPhrase,
          temperatura: parseFloat(dato.Temperature.Value).toFixed(0)
        });
      });
      this.pronostico = datos_pronostico;
      this.cargando = false;
    },

    formatoHora(unix_timestamp) {
      let date = new Date(unix_timestamp * 1000);
      let hours = date.getHours();
      let minutes = "0" + date.getMinutes();
      let seconds = "0" + date.getSeconds();
      let formattedTime =
        hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
      return formattedTime;
    }
  }
};
</script>
<style lang="scss">
.tablita {
  border: solid 0.4px gray;
  border-radius: 6px 6px 6px 6px;
}
</style>
