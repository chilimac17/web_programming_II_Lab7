function FinishedBooks({ books, toggleFinished }) {
  const finishedBooks = books.filter((book) => book.finished);

  if (finishedBooks.length === 0) {
    return (
      <div>
        <h1>Finished Books</h1>
        <p>No finished books yet. Select a Book when you're done reading it!</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Finished Books</h1>
      <p>Number Of Finished Books:({finishedBooks.length}) </p>
      <div>
        {finishedBooks.map((book) => (
          <div key={book.id}>
            <h1>{book.title}</h1>
            <p>Author: {book.author}</p>
            <p>Finish By: {book.due}</p>
            <p>Finished: Yes</p>
            <button onClick={() => toggleFinished(book)}> Mark Unfinished</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FinishedBooks;