<template>
  <div id="app">
    
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
    <div class="footer">
      <a href="https://github.com/hamblinjm/checkout-movie">GitHub Repo</a>
      <p>Images and snynopsis from IMDb</p>
    </div>
  </div>
</template>

<style>
html {
  background-color: rgb(41, 39, 39);
}
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  /* font-family: 'Bebas Neue', cursive; */
  font-family: 'Staatliches', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  color: white;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.footer {
  background-color: rgb(130, 201, 168);
  padding: 10px;
  font-size: 15px;
  margin-top: 50px;
}

.footer p {
  margin-bottom: 0px;
  font-family: 'Staatliches', cursive;
}

h1,h2,h3 {
  font-weight: 100;
}

h1 {
  font-size: 70px;
  margin-bottom: 10px;
}

p {
  /* font-family: 'Source Sans Pro', sans-serif; */
  /* letter-spacing: 1.5px; */
  font-family: 'Roboto Slab', serif;
}
</style>

