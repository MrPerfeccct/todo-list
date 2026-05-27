export default function FilterInput({
  filterTerm,
  onFilterChange,
}) {
  return (
    <div>
      <label htmlFor="filterInput">
        Search todos:
      </label>

      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(event) =>
          onFilterChange(event.target.value)
        }
        placeholder="Search by title..."
      />
    </div>
  );
}