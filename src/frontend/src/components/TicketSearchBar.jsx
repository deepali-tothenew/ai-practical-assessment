export default function TicketSearchBar({ value, onChange, disabled = false }) {
  return (
    <label className="search-bar">
      <span className="search-bar__label">Search</span>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search title or description"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode="search"
        enterKeyHint="search"
        aria-label="Search tickets by title or description"
      />
    </label>
  );
}
