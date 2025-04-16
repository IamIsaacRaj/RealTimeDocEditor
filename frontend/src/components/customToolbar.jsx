import { 
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  List, ListOrdered, Indent, Outdent, Link2, Image, Type, Bold, 
  Italic, Underline, Strikethrough, Code, Quote, Subscript, 
  Superscript, Palette, Highlighter 
} from "lucide-react";

const CustomToolbar = () => {
  return (
    <div className="bg-[#1E293B] border-b border-gray-700">
      <div
        id="toolbar-container"
        className="w-full px-2 py-2 flex flex-wrap items-center gap-4"
      >
        {/* Font and Size */}
        <span className="ql-formats border-r border-gray-600 pr-4">
          <select className="ql-font bg-gray-700 text-white rounded" style={{ width: '160px', minWidth: '160px' }}>
            <option value="arial">Arial</option>
            <option value="times-new-roman">Times New Roman</option>
            <option value="georgia">Georgia</option>
            <option value="courier-new">Courier New</option>
          </select>
          <select className="ql-size bg-gray-700 text-white rounded ml-2" style={{ width: '100px' }}>
            <option value="small">Small</option>
            <option selected>Normal</option>
            <option value="large">Large</option>
            <option value="huge">Huge</option>
          </select>
        </span>

        {/* Text Formatting */}
        <span className="ql-formats border-r border-gray-600 pr-4">
          <button className="ql-bold text-white hover:bg-gray-700 rounded p-1" title="Bold">
            <Bold size={18} />
          </button>
          <button className="ql-italic text-white hover:bg-gray-700 rounded p-1" title="Italic">
            <Italic size={18} />
          </button>
          <button className="ql-underline text-white hover:bg-gray-700 rounded p-1" title="Underline">
            <Underline size={18} />
          </button>
          <button className="ql-strike text-white hover:bg-gray-700 rounded p-1" title="Strikethrough">
            <Strikethrough size={18} />
          </button>
        </span>

        {/* Text Color and Background */}
        <span className="ql-formats border-r border-gray-600 pr-4">
          <select className="ql-color bg-gray-700 text-white rounded" title="Text Color">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="orange">Orange</option>
            <option value="violet">Violet</option>
            <option value="#d0d0d0">Gray</option>
            <option selected>White</option>
          </select>
          <select className="ql-background bg-gray-700 text-white rounded ml-2" title="Background Color">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="orange">Orange</option>
            <option value="violet">Violet</option>
            <option value="#d0d0d0">Gray</option>
            <option selected>None</option>
          </select>
        </span>

        {/* Paragraph Formatting */}
        <span className="ql-formats border-r border-gray-600 pr-4">
          <button className="ql-list text-white hover:bg-gray-700 rounded p-1" value="ordered" title="Ordered List">
            <ListOrdered size={18} />
          </button>
          <button className="ql-list text-white hover:bg-gray-700 rounded p-1" value="bullet" title="Bullet List">
            <List size={18} />
          </button>
          <button className="ql-indent text-white hover:bg-gray-700 rounded p-1" value="-1" title="Decrease Indent">
            <Outdent size={18} />
          </button>
          <button className="ql-indent text-white hover:bg-gray-700 rounded p-1" value="+1" title="Increase Indent">
            <Indent size={18} />
          </button>
        </span>

        {/* Alignment */}
        <span className="ql-formats border-r border-gray-600 pr-4">
          <button className="ql-align text-white hover:bg-gray-700 rounded p-1" value="" title="Left Align">
            <AlignLeft size={18} />
          </button>
          <button className="ql-align text-white hover:bg-gray-700 rounded p-1" value="center" title="Center Align">
            <AlignCenter size={18} />
          </button>
          <button className="ql-align text-white hover:bg-gray-700 rounded p-1" value="right" title="Right Align">
            <AlignRight size={18} />
          </button>
          <button className="ql-align text-white hover:bg-gray-700 rounded p-1" value="justify" title="Justify">
            <AlignJustify size={18} />
          </button>
        </span>

        {/* Insert */}
        <span className="ql-formats border-r border-gray-600 pr-4">
          <button className="ql-link text-white hover:bg-gray-700 rounded p-1" title="Insert Link">
            <Link2 size={18} />
          </button>
          <button className="ql-image text-white hover:bg-gray-700 rounded p-1" title="Insert Image">
            <Image size={18} />
          </button>
        </span>

        {/* History */}
        <span className="ql-formats">
          <button className="ql-undo text-white hover:bg-gray-700 rounded p-1" title="Undo">
            <Undo2 size={18} />
          </button>
          <button className="ql-redo text-white hover:bg-gray-700 rounded p-1" title="Redo">
            <Redo2 size={18} />
          </button>
        </span>
      </div>
    </div>
  );
};

export default CustomToolbar;
