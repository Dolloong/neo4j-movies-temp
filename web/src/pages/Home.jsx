import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import Loading from '../components/Loading.jsx';
import Carousel from '../components/Carousel.jsx';

import * as MovieActions from '../redux/actions/MovieActions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Home extends React.Component {
  constructor() {
    super();

    this.renderFeatured = this.renderFeatured.bind(this);
    this.renderByGenre = this.renderByGenre.bind(this);
  }

  componentWillMount() {
    this.props.getFeaturedMovies();
    this.props.getMoviesByGenres(['Action', 'Drama']);
  }

  render() {
    var {movies} = this.props;
    return (
      <div className="nt-home">
        <div className="row">
          <div className="large-12 columns">
            {movies.isFetching ? <Loading/> : null}
            {this.renderFeatured()}
          </div>
          <div className="large-12 columns">
            {this.renderByGenre('Action')}
            {this.renderByGenre('Drama')}
          </div>
        </div>
      </div>
    );
  }

  renderFeatured() {
    var {movies} = this.props;

    return (
      <div className="nt-home-featured">
        <h3 className="nt-home-header">Featured Movies</h3>
        <ul>
          { _.compact(movies.featured).map(f => {
            return (
              <li>
                <Link to={`/movie/${f.id}`}>
                  <img src={f.posterImage}/>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderByGenre(name) {
    var {movies} = this.props;
    var moviesByGenre = movies.byGenre[name];

    if (_.isEmpty(moviesByGenre)) {
      return null;
    }

    return (
      <div className="nt-home-by-genre">
        <div className="nt-box">
          <div className="nt-box-title">
            {name}
          </div>
          <Carousel>
            { moviesByGenre.map(m => {
              return (
                <div>
                  <Link to={`/movie/${m.id}`}>
                    <img src={m.posterImage}/>
                  </Link>
                  <div className="nt-carousel-movie-title">
                    <Link to={`/movie/${m.id}`}>{m.title}</Link>
                  </div>
                </div>
              )
            })}
          </Carousel>
        </div>
      </div>);
  }
}
Home.displayName = 'Home';

function mapStateToProps(state) {
  return {
    genres: state.genres.items,
    movies: state.movies
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MovieActions, dispatch)
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Home);