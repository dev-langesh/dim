import { cn } from "@/utils/cn";

const { useState, memo } = require("react");
const { IoIosArrowDown, IoIosArrowForward } = require("react-icons/io");

function TreeNodeComponent({ node, onSelect, fetchChildren, selectedPath }) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleExpand() {
    if (node.type !== "dir" || loading) return;
    if (children?.length) {
      setExpanded((prev) => !prev);
      return;
    }
    if (!expanded) {
      setLoading(true);
      try {
        const res = await fetchChildren(node.path);
        setChildren(res);
        console.log(res);
      } catch (err) {
        toast.error("Failed to fetch directory");
      } finally {
        setLoading(false);
      }
    }
    toggleExpand();
  }

  function toggleExpand() {
    setExpanded((prev) => !prev);
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 cursor-pointer pr-3 py-1  rounded hover:bg-zinc-100",
          selectedPath === node.path && "bg-zinc-200 font-medium",
          loading && "bg-zinc-200 animate-pulse hover:bg-zinc-200"
        )}
      >
        {node.type === "dir" ? (
          expanded ? (
            <button
              type="button"
              onClick={toggleExpand}
              className="p-2 pl-3 outline-none cursor-pointer"
            >
              <IoIosArrowDown size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleExpand}
              className="p-2 pl-3 outline-none cursor-pointer"
            >
              <IoIosArrowForward size={14} />
            </button>
          )
        ) : (
          <span className="w-[14px]" />
        )}
        <button
          type="button"
          onClick={() => {
            onSelect(node.path);
          }}
          className=" outline-none cursor-pointer w-full text-left"
        >
          {node.type === "dir" ? `${node.name}` : `${node.name}`}
        </button>
      </div>

      {expanded && !loading && (
        <div className="ml-4 border-l border-zinc-200">
          {children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              onSelect={onSelect}
              fetchChildren={fetchChildren}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const TreeNode = memo(TreeNodeComponent);

export default TreeNode;
