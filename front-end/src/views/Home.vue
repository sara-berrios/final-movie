<template>
  <div class="home">
    <h1>Movie Picker</h1>
    <router-link to='/admin' id="adminButton">Admin</router-link>
    <hr/>

    <div class="buttonWrapper">
      <div class="buttonBox">
        <button @click="showLoginForm">Login</button>
      </div>

      <div class="buttonBox">
        <button @click="showSignupForm">Signup</button>
      </div>
    </div>

    <div class="loginForm" v-if=login>
      <!-- <form> -->
      <div class="form">
        <label>Username:</label>
        <input v-model="username" type="text">
        <br/>
        <label>Password:</label>
        <input v-model="password" type="password">
        <br/>
        <button class="submitButton" @click="submitLogin">Submit</button>
        <p v-if=incorrect>Incorrect username or password</p>
      <!-- </form> -->
      </div>
    </div>

    <div class="signupForm" v-if=signup>
      <!-- <form> -->
      <div class="form">
        <label>First Name:</label>
        <input v-model="firstName" type="text">
        <br/>
        <label>Last Name:</label>
        <input v-model="lastName" type="text">
        <br/>
        <label>Username:</label>
        <input v-model="username" type="text">
        <br/>
        <label>Password:</label>
        <input v-model="password" type="password">
        <br/>
        <label>E-mail:</label>
        <input v-model="email" type="text">
        <br/>
        <button class="submitButton" @click="submitSignup">Submit</button>
      </div>
      <!-- </form> -->
    </div>

    <!-- <h1>View Selection</h1> -->
    <MovieList :movies="movies" />
  </div>
</template>

<script>
import MovieList from '@/components/Movies.vue'
import axios from 'axios';
export default {
  name: 'Home',
  components: {
    MovieList
  },
  data() {
    return {
      mpa: '',
      genre: '',
      login: false,
      signup: false,
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      email: '',
      incorrect: false,
      movies: []
    }
  },
  created() {
    this.getMovies();
  },
  computed: {
    // movies() {
    //   let filteredMovies = this.$root.$data.movies;
    //   // if (this.mpa === '' && this.genre === '') {
    //   //   return this.$root.$data.movies;
    //   // } else if (this.mpa === '') {
    //   //   return this.$root.$data.movies.filter(movie => movie.genre === this.genre);
    //   // }

    //   if (this.mpa !== '') {
    //     filteredMovies = filteredMovies.filter(movie => movie.mpa_rating === this.mpa);
    //   }
    //   if (this.genre !== '') {
    //     filteredMovies = filteredMovies.filter(movie => movie.genre === this.genre);
    //   }
    //   return filteredMovies;
    // }
  },
  methods: {
    select(mpa, genre) {
      this.mpa = mpa;
      this.genre = genre;
    },
    clear() {
      this.mpa = '';
      this.genre = '';
    },
    showLoginForm() {
      this.login = true;
      this.signup = false;
    },
    showSignupForm() {
      this.login = false;
      this.signup = true;
    },
    async submitLogin(){
      try{
        this.incorrect = false;
        const user = await axios.post('/api/users/login', {
            username: this.username,
            password: this.password,
        });
        //console.log(user.data);
        //console.log(this.$root.$data.currentUser);
        this.$root.$data.currentUser = user.data;
        this.$router.push({ path: '/checkout'});
      }catch(error){
        this.incorrect = true;
        //console.log(error);
      }
    },
    async submitSignup(){
      try{
        const user = await axios.post('/api/users', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
          email: this.email,
        });
        this.$root.$data.currentUser = user.data;
        this.$router.push({ path: '/checkout'});
      }catch(error){
        //console.log(error);
      }
    },
    async getMovies() {
      try {
        let tmpMovies = await axios.get('/api/movies');
        this.movies = tmpMovies.data;
      } catch(error) {
        //console.log(error);
      }

      // this.movies = this.$root.$data.allMovies;
    }
  }
}
</script>

<style scoped>
.home-img {
  width: 100%;
  height: 400px;
}

.filter-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: top;
  margin-bottom: 30px;
}

.filter-box {
  width: 200px;
}

h3 {
  margin-top: 0;
}

h1 {
  margin: 50px;
  color: rgb(130, 201, 168);
  margin-bottom: 10px;
}

hr {
  background-color: rgb(130, 201, 168);
}

#clear {
  margin-bottom: 30px;
}

hr {
  /* width: 50%; */
}

button {
  font-family: 'Staatliches', cursive;
  width: 100px;
}
#adminButton{
  margin-left: 90%;
  font-size: 40px;
  color: rgb(130, 201, 168);
}
#adminButton:hover{
  color: white;
}

.buttonWrapper{
  display: flex;
  justify-content:center;
  flex-wrap: wrap;
  flex-direction: row;
}
.signupForm,
.loginForm {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-bottom: 75px;
}
.buttonBox{
  padding: 15px 32px;
  margin: 10px;
}
button{
  background-color: rgb(130, 201, 168);
  font-family: 'Staatliches', cursive;
  font-size: 25px;
}

input {
  margin: 10px;
}
label{
  font-size: 20px;
}
.submitButton{
  margin-top: 15px;
  background-color: white;
  font-size: 20px;
}
</style>
