import { Undo2, Redo2 } from "lucide-react";
const CustomToolbar = () => {
  return (
    <div
      id="toolbar-container"
      className="flex flex-wrap gap-2 p-2 bg-[#3d4b56] text-white rounded-md"
    >
      <span className="ql-formats">
        <select className="ql-font" />
        <select className="ql-size" />
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
      </span>
      <span className="ql-formats">
        <button className="ql-header" value="1" />
        <button className="ql-header" value="2" />
        <button className="ql-blockquote" />
        <button className="ql-code-block" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
      </span>
      <span className="ql-formats">
        <button className="ql-direction" value="rtl" />
        <select className="ql-align" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-formula" />
      </span>
      <span className="ql-formats">
        <button className="ql-clean" />
      </span>

      {/* ✅ Undo/Redo Buttons */}
      <span className="ql-formats">
        <button
          onClick={() => window.quill?.history?.undo()}
          className="ql-undo"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={() => window.quill?.history?.redo()}
          className="ql-redo"
        >
          <Redo2 size={18} />
        </button>
      </span>
    </div>
  );
};

export default CustomToolbar;
