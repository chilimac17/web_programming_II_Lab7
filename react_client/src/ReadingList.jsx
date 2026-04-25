function ReadingList({ books, removeBook, toggleFinished }) {
  const unfinishedBooks = books.filter((book) => !book.finished);

  const isPastDue = (dueDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    return due < today;
  };

  if (unfinishedBooks.length === 0) {
    return (
      <div>
        <h2>Reading List</h2>
        <p>No books in your reading list. Add one above!</p>
      </div>
    );
  }

  return (
    <div >
      <h1>Reading List</h1>
      <p>Number Of Books Left:({unfinishedBooks.length}) </p>
        {unfinishedBooks.map((book) => {
          const overdue = isPastDue(book.due);
          return (
            <div key={book.id}>
              <h1 className={overdue ? 'overdue-text' : ''}>
                {book.title}
              </h1>
              <p>Author: {book.author}</p>
              <p className={overdue ? 'overdue-text' : ''}>
                Finish By: {book.due}
              </p>
              <p>Finished: No</p>
              <div>
                <button
                  onClick={() => removeBook(book.id)}
                >
                  Remove
                </button>
                <button
                  onClick={() => toggleFinished(book)}
                >
                  Mark Finished
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ReadingList;