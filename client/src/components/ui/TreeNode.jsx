import { cn } from "@/utils/cn";

const { useState, memo } = require("react");
const { IoIosArrowDown, IoIosArrowForward } = require("react-icons/io");


function TreeNodeComponent({ node, onSelect, fetchChildren, selectedPath }) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleExpand() {
    if (node.type !== "dir") return;
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
        console.log("loading stop");
      }
    }
    setExpanded((prev) => !prev);
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 cursor-pointer px-3 py-2 rounded hover:bg-zinc-100",
          selectedPath === node.path && "bg-zinc-200 font-medium",
          loading && "bg-zinc-200 animate-pulse hover:bg-zinc-200"
        )}
        onClick={() => {
          if (node.type === "dir") {
            handleExpand();
          }
          onSelect(node.path);
        }}
      >
        {node.type === "dir" ? (
          expanded ? (
            <IoIosArrowDown size={14} />
          ) : (
            <IoIosArrowForward size={14} />
          )
        ) : (
          <span className="w-[14px]" />
        )}
        {node.type === "dir" ? `${node.name}` : `${node.name}`}
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
