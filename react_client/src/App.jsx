import { useState } from 'react'
import './App.css'
import ReadingList from './ReadingList';
import FinishedBooks from './FinishedBooks';
import AddBook from './AddBook';

const initialBooks = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', due: '3/15/2023', finished: false },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', due: '4/01/2023', finished: false },
  { id: 3, title: 'You Don\'t Know JS', author: 'Kyle Simpson', due: '5/10/2023', finished: false },
  { id: 4, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', due: '6/20/2023', finished: false },
  { id: 5, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', due: '7/05/2023', finished: false },
  { id: 6, title: 'Design Patterns', author: 'Gang of Four', due: '8/15/2023', finished: false },
  { id: 7, title: 'The Mythical Man-Month', author: 'Frederick P. Brooks Jr.', due: '9/01/2023', finished: false },
  { id: 8, title: 'Refactoring', author: 'Martin Fowler', due: '10/10/2023', finished: false },
  { id: 9, title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest & Stein', due: '11/25/2023', finished: false },
  { id: 10, title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson & Gerald Jay Sussman', due: '12/31/2023', finished: false },
];




function App() {
  const [books, setBooks] = useState(initialBooks);
const removeBook = (id) => {
    setBooks((prev) => {
      const updated_list = [];
      for (const book of prev) {
        if (book.id !== id) {
          updated_list.push(book);
        }
      }

      return updated_list;
    });
  };

  const toggleFinished = (book) => {
    setBooks((prev) =>
      prev.map((prevBook) =>
        prevBook.id === book.id ? { ...prevBook, finished: !prevBook.finished } : prevBook
      )
    );
  };

  const addBook = ({ title, author, due }) => {
    const newBook = {
      id: Date.now(),
      title,
      author,
      due,
      finished: false,
    };
    setBooks((prev) => [...prev, newBook]);
  };

  return (
    <div>
      <AddBook addBook={addBook} />
      <ReadingList books={books} removeBook={removeBook} toggleFinished={toggleFinished} />
      <FinishedBooks books={books} toggleFinished={toggleFinished} />
    </div>
  )
}

export default App
