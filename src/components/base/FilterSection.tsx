import { DownOutlined, UpOutlined } from '@ant-design/icons';

const FilterSection = ({ title, expanded, onToggle, children }) => (
  <div className="border-b border-gray-100">
    <button
      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      onClick={onToggle}
    >
      <span className="text-sm font-normal text-gray-500">{title}</span>
      {expanded ? (
        <UpOutlined className="text-gray-400 text-xs" />
      ) : (
        <DownOutlined className="text-gray-400 text-xs" />
      )}
    </button>
    {expanded && <div className="px-6 pb-5">{children}</div>}
  </div>
);
export default FilterSection;
