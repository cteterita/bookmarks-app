import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import UpdateBookmark from './UpdateBookmark/UpdateBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import BookmarksContext from './BookmarksContext';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  updateBookmark = bookmark => {
    console.log(bookmark);
    const newBookmarks = this.state.bookmarks.filter((b) => b.id !== bookmark.id);
    console.log(newBookmarks);
    this.setState({
      bookmarks: [ ...newBookmarks, bookmark ],
    })
  }

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      updateBookmark: this.updateBookmark,
    }
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
        <Nav />
        <div className='content' aria-live='polite'>
          <Route
            path='/add-bookmark'
            component={AddBookmark}
          />
          <Route
            path='/update-bookmark/:bookmarkId'
            component={UpdateBookmark}
          />
          <Route
            exact
            path='/'
            component={BookmarkList}
          />
        </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
