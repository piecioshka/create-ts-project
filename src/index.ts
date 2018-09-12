interface IMovie {
    name: string;
    poster: string;
}

// ----------------------------------------------

const random = {
    get name() {
        return 'Fast & furious 9 (2020)';
    }
};

function displayMovie(movie: IMovie) {
    console.log(movie.name);
}

displayMovie( random );
