export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="error-banner" role="alert">
      <p className="error-banner__message">{message}</p>
      {onRetry && (
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
