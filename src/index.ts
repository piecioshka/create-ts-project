interface IMovie {
    name: string;
    poster: string;
}

// ----------------------------------------------

const random = {
    name: 'Fast & furious 9 (2020)'
};

function displayMovie(movie: IMovie) {
    console.log(movie.name);
}

displayMovie( random as IMovie );
