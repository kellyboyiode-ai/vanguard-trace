export default function TraceFeedItem({ title, description, status }) {
  return (
    <article className="feed-item">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span>{status}</span>
    </article>
  );
}
