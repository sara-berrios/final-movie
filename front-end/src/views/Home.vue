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
        <input v-model="usernameLogin" type="text">
        <br/>
        <label>Password:</label>
        <input v-model="passwordLogin" type="password">
        <br/>
        <button class="submitButton" @click="submitLogin">Submit</button>
        <p v-if=invalidLogin>Incorrect username or password</p>
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
        <p v-if=invalidSignup>All fields are required </p>
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
      usernameLogin: '',
      passwordLogin: '',
      invalidLogin: false,
      invalidSignup: false,
      movies: [],
      error: '',
      errorLogin: '',

    }
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
    this.getMovies();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
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
      this.error = '';
      this.errorLogin = '';
      this.invalidLogin = false;
      if (!this.usernameLogin || !this.passwordLogin) {
        this.invalidLogin = true;
        return;
      }
      try{
        const response = await axios.post('/api/users/login', {
            username: this.usernameLogin,
            password: this.passwordLogin,
        });
        //console.log(user.data);
        //console.log(this.$root.$data.user);
        this.$root.$data.user = response.data.user;
        if(this.$root.$data.user.role === 'admin') {
          this.$router.push({ path: '/admin'});
        } else {
          this.$router.push({ path: '/checkout'});
        }
      }catch(error){
        this.invalidLogin = true;
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async submitSignup(){
      this.error = '';
      this.errorLogin = '';
      this.invalidSignup = false;
      if (!this.firstName ||
          !this.lastName ||
          !this.username ||
          !this.password ||
          !this.email) {
            this.invalidSignup = true;
            return;
        }
      try{
        const response = await axios.post('/api/users', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
          email: this.email,
        });
        this.$root.$data.user = response.data.user;
        this.$router.push({ path: '/checkout'});
      } catch(error){
        this.error = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
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
