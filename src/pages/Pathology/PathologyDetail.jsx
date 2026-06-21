import { useParams } from "react-router-dom";

export default function PathologyDetail() {
  const { id } = useParams();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pathology</h1>
        <p>جزئیات آسیب‌شناسی</p>
      </div>

      <div className="content-card">
        <h2>Case {id}</h2>
        <p>این بخش در حال تکمیل است.</p>
      </div>
    </div>
  );
}