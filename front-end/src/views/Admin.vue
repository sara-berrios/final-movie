<template>
<div class="outer">
  <h1>Admin</h1>
  <router-link id='homeButton' to='/'>Home</router-link>

  <div class="buttonWrapper">
    <div class="buttonBox">
      <button @click="showEditForm">Edit a Movie</button>
    </div>

    <div class="buttonBox">
      <button @click="showDeleteForm">Delete a Movie</button>
    </div>

    <div class="buttonBox">
      <button @click="showAddForm">Add a Movie</button>
    </div>
  </div>

  <div class="add" v-if=adding>
    <div class="form">
      <label>Title: </label>
      <input v-model="title">
      <p></p>
      <label>MPA Rating: </label>
      <input v-model="mpa">
      <p></p>
      <label>Genre: </label>
      <input v-model="genre">
      <p></p>
      <label>IMDb Rating: </label>
      <input v-model="imdb" placeholder="Number between 1-10">
      <p></p>
      <label>Summary: </label>
      <textarea v-model="summary">Description</textarea>
      <p></p>
      <input type="file" name="photo" @change="fileChanged">
      <button @click="addMovie">Add</button>
    </div>
  </div>

  <div class="delete" v-if=deleting>
    <div class="deleteForm">
      <div v-for="movie in movies" :key="movie._id">
        <img :src="movie.path">
        <h3>{{movie.title}}</h3>
        <button class="deleteButton"  @click="deleteMovie(movie)">Delete</button>
      </div>
    </div>
  </div>

  <div class="edit" v-if=editing>
    <div class="editForm">
      <div v-for="movie in movies" :key="movie._id">
        <img :src="movie.path">
        <h3>{{movie.title}}</h3>
        <button class="editButton"  @click="redirectToEdit(movie)">Edit</button>
      </div>
    </div>
  </div>
      <!--
      <select v-model="mpa" id="mpa">
        <option v-bind:value="G">G</option>
        <option v-bind:value="PG">PG</option>
        <option v-bind:value="PG-13">PG-13</option>
        <option v-bind:value="R">R</option>
        <option v-bind:value="other">Other</option>
      </select>
      -->
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Admin',
  data() {
    return {
      title: "",
      mpa: "",
      genre: "",
      imdb: "",
      summary: "",
      adding: false,
      deleting: false,
      editing: false,
      file: null,
      movies: [],
    }
  },
  created() {
    return this.getMovies();
    //this.movies = this.$root.$data.allMovies;
  },
  methods:{
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    showAddForm(){
      this.adding = true;
      this.editing = false;
      this.deleting = false;
    },
    showDeleteForm() {
      this.adding = false;
      this.editing = false;
      this.deleting = true;
    },
    showEditForm() {
      this.adding = false;
      this.editing = true;
      this.deleting = false;
    },
    async getMovies() {
      try {
          let response = await axios.get("/api/movies");
          this.movies = response.data;
          this.$root.$data.allMovies = this.movies;
          // this.$root.$data.allMovies = response.data;
          // this.movies = this.$root.$data.allMovies;
          return true;
      } catch (error) {
          //console.log(error);
      }
    },
    async addMovie(){
      try{
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/movies', {
          title: this.title,
          path: r1.data.path,
          mpa: this.mpa,
          genre: this.genre,
          imdb: this.imdb,
          summary: this.summary,
        });
        this.addItem = r2.data;
        this.$router.push({ path: '/'});
        //console.log(r2);
      }
      catch(error){
        //console.log(error);
      }
    },

    async deleteMovie(movie) {
      try {
        await axios.delete("/api/movies/" + movie._id);
        this.getMovies();
        this.$router.push({ path: '/'});
        return true;
      } catch(error) {
        //console.log(error);
      }
    },

    redirectToEdit(currentMovie){
      this.$root.$data.movie = currentMovie;
      this.$router.push({ path: '/edit'});
    },
  }

}
</script>

<style scoped>
.buttonWrapper{
  display: flex;
  justify-content:center;
  flex-wrap: wrap;
  flex-direction: row;
}
.deleteForm,
.editForm {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
.buttonBox{
  padding: 15px 32px;
}
button{
  background-color: rgb(130, 201, 168);
  font-family: 'Staatliches', cursive;
  font-size: 25px;
}

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
  /* margin-bottom: 30px; */
  width: 80%;
  margin: 0 auto;
}

a {
  color: #42b983;
  font-family: 'Roboto Slab', serif;
}

/* button {
  font-family: 'Staatliches', cursive;
  width: 100px;
} */
#homeButton{
  margin-left: 90%;
  font-size: 40px;
  color: rgb(130, 201, 168);
  font-family: 'Staatliches', cursive;
}
#homeButton:hover{
  color: white;
}

.deleteButton {
  background-color:#c92d25;
}

.editButton {
  background-color: #f3f710;
}
</style>
