<template>
<div class="info">
  <h1>{{movie.title}}</h1>
  <div class="content">
    <img :src="movie.path">
    <div class="details">
      <button v-if="user && !isCheckedOut" @click="checkout">Checkout</button>
      <button v-if="user && isCheckedOut" @click="returnMovie">Return</button>

      <p>MPA Rating: {{movie.mpa}}</p>
      <p>Genre: {{movie.genre}}</p>
      <p>IMDb Rating: {{movie.imdb}} / 10</p>
      <p>Synopsis: {{movie.summary}}</p>
      <br />
      <button class="backButton" @click="goBack">Back</button>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Info',
  data() {
    return {
      movie: {},
      isCheckedOut: false
    }
  },
  async created() {
    this.movie = (await axios.get(`/api/movies/${this.$route.params.id}`)).data;
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
      this.error = error.response.data.message;
    }
    this.getIsCheckedOut();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    async checkout() {
      try {
        await axios.put(`/api/movies/${this.movie._id}/checkout/${this.$root.$data.user._id}`);
        this.$router.push('/checkout');
      } catch(error) {
        //console.log(error);
      }
    },
    async returnMovie(){
      try{
        await axios.put(`/api/movies/${this.movie._id}/return/`);
        this.$router.push('/checkout');
      }catch(error){
        //console.log(error);
      }
    },
    goBack(){
      if(!this.user){
        this.$router.push('/');
      }else{
        this.$router.push('/checkout');
      }
    },
    getIsCheckedOut(){
      if(this.user){
        if(this.user._id === this.movie.user){
          this.isCheckedOut = true;
        }
      }
    }
  }
}
</script>

<style scoped>
img {
  height: 400px;
  width: 300px;
}

.info {
  justify-content: center;
  text-align: center;
  display: float;
}

.details {
  width: 400px;
  justify-content: center;
  text-align: center;
}

.content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  width: 80%;
  margin: 0 auto;
}

a {
  color: #42b983;
  font-family: 'Roboto Slab', serif;
}
button{
  background-color: rgb(130, 201, 168);
  font-family: 'Staatliches', cursive;
  font-size: 25px;
}
.backButton{
  margin-top: 15px;
  background-color: white;
  font-size: 20px;
}
</style>
