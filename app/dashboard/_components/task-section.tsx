import { Task } from "@prisma/client";
import { format } from "date-fns";
import { CalendarCheck2, CheckCircle2, Clock } from "lucide-react";

type TaskSectionProps = {
  todayTasks: Task[];
  upcomingTasks: Task[];
};

export function TaskSection({ todayTasks, upcomingTasks }: TaskSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
      </div>

      {/* Today's Tasks */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <CalendarCheck2 className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Today</h3>
        </div>

        {todayTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks scheduled for today.</p>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      <div>
        <div className="flex items-center mb-4">
          <Clock className="mr-2 h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-medium">Upcoming</h3>
        </div>

        {upcomingTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming tasks.</p>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  return (
    <div className="flex items-start p-3 border rounded-md border-gray-200 hover:bg-gray-50">
      <div className="flex-shrink-0 mr-3 mt-1">
        {task.isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
        )}
      </div>
      <div className="flex-grow min-w-0">
        <p
          className={`font-medium ${
            task.isCompleted ? "line-through text-gray-500" : ""
          }`}
        >
          {task.name}
        </p>
        <p className="text-sm text-gray-500 truncate">{task.description}</p>
        <p className="text-xs text-gray-400 mt-1">
          Due: {format(new Date(task.dueDate), "MMM d, h:mm a")}
        </p>
      </div>
    </div>
  );
}
