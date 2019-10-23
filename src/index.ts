interface IMovie {
    name: string;
    poster: string;
}

// ----------------------------------------------

const random = {
    name: 'Green Book'
};

function displayMovie(movie: IMovie) {
    console.log(movie.name);
}

displayMovie(random as IMovie);
