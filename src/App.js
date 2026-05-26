import React, { useEffect, useState } from "react";
import "./App.css";
import API from "./services/api";
import banner from "./assets/banner.jpg";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
  });

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [selectedGenre, setSelectedGenre] = useState("");

  // FETCH BOOKS
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await API.get("/books");

      setBooks(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD OR UPDATE BOOK
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (
      !formData.title ||
      !formData.author ||
      !formData.genre ||
      !formData.year
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        // UPDATE BOOK
        await API.put(`/books/${editId}`, formData);
        setEditId(null);
      } else {
        // ADD BOOK
        await API.post("/books", formData);
      }

      // CLEAR FORM
      setFormData({
        title: "",
        author: "",
        genre: "",
        year: "",
      });

      fetchBooks();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE BOOK
  const deleteBook = async (id) => {
    try {
      await API.delete(`/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT BOOK
  const editBook = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
    });

    setEditId(book.id);
  };

  // FILTER BOOKS
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesGenre =
      selectedGenre === "" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  // UNIQUE GENRES
  const genres = [...new Set(books.map((book) => book.genre))];

  return (
    <div>
      {/* HERO SECTION */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        <div className="overlay">
          <h1 className="hero-title">
            📚 Book Management System
          </h1>

          <p className="hero-subtitle">
            A modern React application for managing book records
          </p>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="container">
        {/* SEARCH + FILTER */}
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="filter-select"
          >
            <option value="">All Genres</option>

            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
          />

          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="form-input"
          />

          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            className="form-input"
          />

          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            className="form-input"
          />

          <button type="submit" className="add-btn">
            {editId ? "Update Book" : "Add Book"}
          </button>
        </form>

        {/* LOADING */}
        {loading && (
          <p className="no-books">
            Loading books...
          </p>
        )}

        {/* BOOK LIST */}
        {!loading && filteredBooks.length === 0 ? (
          <p className="no-books">
            No Books Found
          </p>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <h3>
                📘 {book.title}
              </h3>

              <hr />

              <p>
                <strong>Author:</strong> {book.author}
              </p>

              <p>
                <strong>Genre:</strong> {book.genre}
              </p>

              <p>
                <strong>Year:</strong> {book.year}
              </p>

              <div className="action-buttons">
                <button
                  onClick={() => editBook(book)}
                  className="edit-btn"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteBook(book.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        Developed using React JS • CRUD • MockAPI
      </footer>
    </div>
  );
}

export default App;