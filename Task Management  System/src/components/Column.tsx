type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
};

type ColumnProps = {
  title: string;
  tasks: Task[];
  onClick: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd?: () => void;
};

import TaskCard from "./TaskCard";

export default function Column({
  title,
  tasks,
  onClick,
  onDelete,
  onAdd,
}: ColumnProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl h-[500px] flex flex-col shadow-sm border">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700">
          {title} ({tasks.length})
        </h2>

        {onAdd && (
          <button
            onClick={onAdd}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
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
      <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              onClick={() => onClick(task)}
              style={{ animationDelay: `${index * 100}ms` }}
              className="animate-fadeInUp"
            >
              <TaskCard
                task={task}
                
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}