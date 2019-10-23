interface IMovie {
    name: string;
    poster: string;
}

// ----------------------------------------------

const random = {
    name: 'Example Movie Title'
};

function displayMovie(movie: IMovie) {
    console.log(movie.name);
}

displayMovie(random as IMovie);
