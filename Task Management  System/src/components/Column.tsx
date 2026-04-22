type Task = {
  id: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
};

type ColumnProps = {
  title: string;
  tasks: Task[];
  onClick: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd?: () => void;
};

export default function Column({
  title,
  tasks,
  onClick,
  onDelete,
  onAdd,
}: ColumnProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl min-h-[420px] shadow-sm border">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700">{title}</h2>

        {onAdd && (
          <button
            onClick={onAdd}
            className="text-xs bg-blue-500 text-white px-3 py-1 rounded-md"
          >
            + Add
          </button>
        )}
      </div>

      {/* Tasks */}
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm text-center mt-10">
          No tasks
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onClick(task)}
              className="bg-white p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md"
            >
              <div className="flex justify-between items-center">

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-800">
                  {task.title}
                </h3>

                {/* Priority badge */}
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    task.priority === "HIGH"
                      ? "bg-red-100 text-red-600"
                      : task.priority === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {task.priority}
                </span>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  🗑
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}