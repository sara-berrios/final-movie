<template>
<div class="outer">

  <div class="header">
    <button id="logout" @click="logout">Logout</button>
    <h1>Admin</h1>
  </div>

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

    <div class="buttonBox">
      <button id="showAll" @click="showAll">Show All Movies</button>
    </div>
  </div>

  <div class="add" v-if=adding>
    <div class="form">
      <label>Title: </label>
      <input v-model="title">
      <p class="break"></p>
      <label>MPA Rating: </label>
      <input v-model="mpa">
      <p class="break"></p>
      <label>Genre: </label>
      <input v-model="genre">
      <p class="break"></p>
      <label>IMDb Rating: </label>
      <input v-model="imdb" placeholder="Number between 1-10">
      <p class="break"></p>
      <label>Summary: </label>
      <textarea v-model="summary">Description</textarea>
      <p class="break"></p>
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

  <div class="view" v-if=viewing>
    <hr/>
      <h2>Checked Out Movies</h2>
      <div class="viewForm">

      <div v-for="movie in checkedOutMovies" :key="movie._id">
        <img :src="movie.path">
        <h3>{{movie.title}}</h3>
        <p>Checked out by: {{movie.user.firstName}} {{movie.user.lastName}} </p>
        <p>Contact: {{movie.user.email}}</p>
      </div>
      </div>
      <hr/>

      <h2>Available Movies</h2>
      <div class="viewForm">
        <div v-for="movie in availableMovies" :key="movie._id">
          <img :src="movie.path">
          <h3>{{movie.title}}</h3>
        </div>
    </div>
  </div>

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
      viewing: false,
      file: null,
      movies: [],
      availableMovies: [],
      checkedOutMovies: [],
    }
  },
   async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
    this.getAvailableMovies();
    this.getCheckedOutMovies();
    this.getMovies();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },

  },
  methods:{
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    showAddForm(){
      this.adding = true;
      this.editing = false;
      this.deleting = false;
      this.viewing = false;
    },
    showDeleteForm() {
      this.adding = false;
      this.editing = false;
      this.deleting = true;
      this.viewing = false;
    },
    showEditForm() {
      this.adding = false;
      this.editing = true;
      this.deleting = false;
      this.viewing = false;
    },
    showAll() {
      this.adding = false;
      this.editing = false;
      this.deleting = false;
      this.viewing = true;
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
        let r1 = await axios.post('/api/movies/photos', formData);
        let r2 = await axios.post('/api/movies', {
          title: this.title,
          path: r1.data.path,
          mpa: this.mpa,
          genre: this.genre,
          imdb: this.imdb,
          summary: this.summary,
        });
        this.addItem = r2.data;
        this.$router.push({ path: '/admin'});
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
        return true;
      } catch(error) {
        //console.log(error);
      }
    },

    redirectToEdit(currentMovie){
      this.$root.$data.movie = currentMovie;
      this.$router.push({ path: '/edit'});
    },

    async logout(){
      try{
        await axios.delete("/api/users");
        this.$root.$data.user = null;
        this.$router.push({ path: '/'});
      }catch(error){
        console.log(error);
      }
    },

    async getAvailableMovies() {
      try {
        let response = await axios.get("/api/movies/available");
        this.availableMovies = response.data;
      } catch(error) {
        console.log(error);
      }
    },
    async getCheckedOutMovies() {
      try {
        let response = await axios.get("/api/movies/checked-out");
        this.checkedOutMovies = response.data;
      } catch(error) {
        console.log(error);
      }
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
.editForm,
.viewForm {
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
  width: 80%;
  margin: 0 auto;
}
a {
  color: #42b983;
  font-family: 'Roboto Slab', serif;
}
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
  margin-bottom: 30px;
}
.editButton {
  background-color: #f3f710;
  margin-bottom: 30px;
}
h1{
  text-align: center;
}
#logout {

  float: right;
  margin-left: -50%;
  margin-right: 40px;
  margin-top: 3em;
  background-color: white;
}
.header{
  overflow: hidden;
}
p{
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 13px;
}
hr{
  margin-top: 30px;
}
h3{
  margin-bottom: 5px;
}
.break{
  margin-top: 15px;
}


@media only screen and (max-width: 400px) {
  #logout {
    margin-right: 0px;
  }
  p{
    margin-top: 0px;
    margin-bottom: 10px;
  }

}
</style>
