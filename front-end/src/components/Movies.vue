<template>
    <div class="movies">
        <!--
        <div v-for="movie in movies" :key="movie.id">
            <img :src="'images/' +movie.image">
            <h3>{{movie.title}}</h3>
        </div>
        <router-link v-for="movie in movies" :key="movie._id" to="{ name: 'movie', params: { id: movie._id }}" style="display: inline-block;text-decoration:none;" @click.native="updateMovie(movie)">
        <img :src="'images/' +movie.image">

        </router-link>
        -->

            <div v-for="movie in movies" :key="movie._id" style="display: inline-block;text-decoration:none;">
              <router-link :to="'/movie/' + movie._id" style="display: inline-block;text-decoration:none;">
                <img :src="movie.path">
                <h3>{{movie.title}}</h3>
              </router-link>
            </div>


    </div>
</template>

<script>
// import axios from "axios";

export default {
    name: 'MovieList',
    props: {
        movies: Array
    },

    methods: {
        updateMovie(newMovie){
          this.$root.$data.movie = newMovie;
          this.$router.push("movie");
        }
    }
}
</script>

<style scoped>
/* .movie {
    width: 300px;
} */

.movies {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

li a {
    color: white;
    text-decoration: none;
}

h3 {
    color: white;
    text-decoration: none;
    width: 182px;
}

img {
    width: 182px;
    height: 268px;
}

</style>
