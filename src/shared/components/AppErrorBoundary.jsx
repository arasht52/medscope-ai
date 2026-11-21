import { Component, createRef } from "react";
import Button from "./Button.jsx";
import "./AcademicPrototype.css";
import "./AppErrorBoundary.css";

export default class AppErrorBoundary extends Component {
  state = { failed: false };
  heading = createRef();

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error("MedScope rendering error", error, info);
    this.heading.current?.focus({ preventScroll: true });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="academic-ui app-error-boundary" dir="rtl" lang="fa">
      <section aria-labelledby="app-error-heading">
        <h1 id="app-error-heading" ref={this.heading} tabIndex={-1}>نمایش صفحه با مشکل روبه‌رو شد</h1>
        <p>لطفاً صفحه را دوباره بارگذاری کنید یا به خانه برگردید.</p>
        <div className="app-error-boundary__actions">
          <Button onClick={() => window.location.reload()} fullWidth>بارگذاری دوباره</Button>
          <Button onClick={() => window.location.assign("/")} variant="ghost" fullWidth>بازگشت به خانه</Button>
        </div>
      </section>
    </main>;
  }
}
