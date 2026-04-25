import { useState } from 'react';

const getTODString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const convertDateFormat = (isoDate) => {
  // Convert yyyy-mm-dd to m/d/yyyy
  const [yyyy, mm, dd] = isoDate.split('-');
  return `${parseInt(mm)}/${parseInt(dd)}/${yyyy}`;
};

function AddBook({ addBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [due, setDue] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Title is required.';
    } else if (trimmedTitle.length < 2) {
      newErrors.title = 'Title must be at least 2 characters.';
    } else if (trimmedTitle.length > 255) {
      newErrors.title = 'Title must be 255 characters or fewer.';
    }

    const trimmedAuthor = author.trim();
    if (!trimmedAuthor) {
      newErrors.author = 'Author is required.';
    } else if (trimmedAuthor.length < 5) {
      newErrors.author = 'Author must be at least 5 characters.';
    } else if (trimmedAuthor.length > 255) {
      newErrors.author = 'Author must be 255 characters or fewer.';
    }

    if (!due) {
      newErrors.due = 'Due date is required.';
    } else {
      const selectedDate = new Date(due + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.due = 'Due date cannot be in the past.';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setSuccess(false);
      return;
    }

    addBook({
      title: title.trim(),
      author: author.trim(),
      due: convertDateFormat(due),
    });

    // Reset form
    setTitle('');
    setAuthor('');
    setDue('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
      <h1>Add a Book</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Book title"
          />
        </div>

        <div>
          <label htmlFor="author">Author</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
          />
        </div>

        <div>
          <label htmlFor="due">Due Date</label>
          <input
            id="due"
            type="date"
            value={due}
            min={getTODString()}
            onChange={(e) => setDue(e.target.value)}
          />
        </div>

        <button type="submit">
          Add Book
        </button>

        {success && <p>Book added successfully!</p>}
      </form>
    </div>
  );
}

export default AddBook;