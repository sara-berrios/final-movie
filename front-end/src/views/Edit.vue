<template>
<div class="info">
  <h1>Edit This Movie</h1>
  <div class="content">
    <img :src="movie.path">

    <div class="add">
      <div class="form">
        <label>Title: </label>
        <input type="text" v-model="title">
        <p></p>
        <label>MPA Rating: </label>
        <input v-model="mpa" :placeholder="[[movie.mpa]]">
        <p></p>
        <label>Genre: </label>
        <input v-model="genre" :placeholder="[[movie.genre]]">
        <p></p>
        <label>IMDb Rating: </label>
        <input v-model="imdb" :placeholder="[[movie.imdb]]">
        <p></p>
        <label>Summary: </label>
        <textarea v-model="summary" :placeholder="[[movie.summary]]">Description</textarea>
        <p></p>
        <button @click="submitEdits" id="submit">Submit Edits</button>
      </div>
    </div>

  </div>
  <button class="backButton" @click="goBack">Back</button>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Info',
  data() {
    return {
      title: this.$root.$data.movie.title,
      mpa: this.$root.$data.movie.mpa,
      genre: this.$root.$data.movie.genre,
      imdb: this.$root.$data.movie.imdb,
      summary: this.$root.$data.movie.summary,
      movie: {}
    }
  },
  created() {
      this.movie = this.$root.$data.movie;
      this.$forceUpdate();
  },
  methods:{
    async submitEdits(){
      try {
        await axios.put("/api/movies/" + this.movie._id, {
          title: this.title,
          mpa: this.mpa,
          genre: this.genre,
          imdb: this.imdb,
          summary: this.summary,
          path: this.movie.path,
        });
        this.$router.push({ path: '/admin'});
        return true;
      } catch (error) {
        /*console.log(error);*/
      }
    },
    goBack(){
      this.$router.push('/admin');
    },
  },
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
#submit{
  background-color: rgb(130, 201, 168);
  font-family: 'Staatliches', cursive;
  font-size: 25px;
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
