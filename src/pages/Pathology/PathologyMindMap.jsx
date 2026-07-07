import "./PathologyMindMap.css";

/**
 * PathologyMindMap — an alternative, memory-friendly "mind-map" view of a
 * pathology item, auto-generated from the SAME data the notes (جزوه) view uses.
 * No new data fields are required; branches simply render whichever fields the
 * item already has. This is an additive view — the notes layout is untouched.
 *
 * Design intent (per user feedback): the disease sits at the center, and the
 * high-yield categories fan out as color-coded branches with their key points
 * as leaves — easier to memorize than a long linear column of bullets. It is a
 * distilled skeleton, not a repeat of every section; the full detail stays in
 * the notes tab.
 */

// Distilled high-yield branches. `__morphology` and `__diagnosis` merge two
// closely-related fields into one branch to keep the map sparse.
const BRANCHES = [
  { key: "etiology", label: "علت", color: "teal" },
  { key: "__morphology", label: "مورفولوژی", color: "blue" },
  { key: "clinical_features", label: "بالینی", color: "amber" },
  { key: "__diagnosis", label: "تشخیص و افتراق", color: "purple" },
];

function branchItems(item, key) {
  if (key === "__morphology") {
    return [...(item.gross_features || []), ...(item.microscopic_features || [])];
  }
  if (key === "__diagnosis") {
    return [...(item.diagnostic_clues || []), ...(item.differential_diagnosis || [])];
  }
  return item[key] || [];
}

export default function PathologyMindMap({ item }) {
  const branches = BRANCHES.map((b) => ({ ...b, items: branchItems(item, b.key) })).filter(
    (b) => b.items.length > 0
  );

  return (
    <div className="mindmap">
      <div className="mindmap__center">
        <span className="mindmap__center-title">{item.title_fa}</span>
        {item.definition && <span className="mindmap__center-sub">{item.definition}</span>}
      </div>

      <div className="mindmap__spine" aria-hidden="true" />

      <div className="mindmap__branches">
        {branches.map((b) => (
          <section key={b.key} className={`mindmap__branch mindmap__branch--${b.color}`}>
            <h3 className="mindmap__branch-head">{b.label}</h3>
            <ul className="mindmap__leaves">
              {b.items.map((line, i) => (
                <li key={i} className="mindmap__leaf">
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {(item.exam_trap?.length > 0 || item.mnemonic) && (
        <div className="mindmap__highlights">
          {item.exam_trap?.length > 0 && (
            <section className="mindmap__branch mindmap__branch--red mindmap__branch--wide">
              <h3 className="mindmap__branch-head">تله‌ی امتحانی</h3>
              <ul className="mindmap__leaves">
                {item.exam_trap.map((line, i) => (
                  <li key={i} className="mindmap__leaf">
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {item.mnemonic && (
            <section className="mindmap__branch mindmap__branch--green mindmap__branch--wide">
              <h3 className="mindmap__branch-head">مِنِمونیک</h3>
              <p className="mindmap__leaf mindmap__leaf--text">{item.mnemonic}</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
