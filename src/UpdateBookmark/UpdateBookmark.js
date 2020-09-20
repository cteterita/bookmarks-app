import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './UpdateBookmark.css';

const Required = () => (
  <span className='UpdateBookmark__required'>*</span>
)

class UpdateBookmark extends Component {
  static contextType = BookmarksContext;

  state = {
    error: null,
    title: null,
    description: null,
    url: null,
    rating: null,
  };

  updateTitle = (e) => {
    this.setState({ title: e.target.value });
  }

  updateDescription = (e) => {
    this.setState({ description: e.target.value });
  }

  updateUrl = (e) => {
    this.setState({ url: e.target.value });
  }

  updateRating = (e) => {
    this.setState({ rating: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { title, url, description, rating } = this.state;
    const bookmark = {
      title,
      url,
      description,
      rating,
      id: Number(this.props.match.params.bookmarkId),
    }
    this.setState({ error: null })
    fetch(`${config.API_ENDPOINT}/${bookmark.id}`, {
      method: 'PATCH',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        console.log(res);
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
      })
      .catch(error => {
        this.setState({ error })
      })
    this.context.updateBookmark(bookmark);
    this.props.history.push('/');
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  }

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/${this.props.match.params.bookmarkId}`, {
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
        return res.json()
      })
      .then(data => {
        const { title, description, rating, url } = data;
        this.setState({ title, description, rating, url });
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  render() {
    const { error } = this.state
    return (
      <section className='UpdateBookmark'>
        <h2>Create a bookmark</h2>
        <form
          className='UpdateBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='UpdateBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              value={this.state.title}
              onChange={this.updateTitle}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              value={this.state.url}
              onChange={this.updateUrl}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={this.state.description}
              onChange={this.updateDescription}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              value={this.state.rating}
              onChange={this.updateRating}
              min='1'
              max='5'
              required
            />
          </div>
          <div className='UpdateBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default UpdateBookmark;
