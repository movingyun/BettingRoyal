import { Link } from "react-router-dom";

function NoticeDetail({ id, title, updatedAt, content }) {
  return (
    <div>
      <p>id: {id}</p>
      <Link to={`/notice-detail/${id}`}>
        <p>title: {title}</p>
      </Link>
      <p>content: {content}</p>
      <p>updatedAt: {updatedAt}</p>
    </div>
  );
}

export default NoticeDetail;
