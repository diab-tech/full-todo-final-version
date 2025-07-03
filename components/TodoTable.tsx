// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ITodo } from "@/interfaces";
// import { Badge } from "@/components/ui/badge";
// import TodosTableAction from "./TodosTableAction";

// function TodoTable({
//   todos,
//   onEditClick,
//   onDeleteSuccess,
// }: {
//   todos: ITodo[];
//   onEditClick: (todo: ITodo) => void;
//   onDeleteSuccess: (id: string) => void;
// }) {
//   if (!todos || !Array.isArray(todos)) {
//     return <div>No todos available.</div>;
//   }

//   return (
//     <Table className="table-fixed w-full">
//       <TableCaption>A list of your recent TODOs.</TableCaption>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="flex-grow min-w-[300px]">Title</TableHead> {/* العنوان ياخد العرض الباقي */}
//           <TableHead className="w-[108.84px] text-center">Status</TableHead>
//           <TableHead className="w-[93.76px] text-center">Label</TableHead>
//           <TableHead className="w-[91.35px] text-center">Priority</TableHead>
//           <TableHead className="w-[92.44px] text-right">Action</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {todos.map((todo: ITodo) => (
//           <TableRow key={todo.id}>
//             <TableCell className="flex-grow min-w-[300px] overflow-hidden">
//               <div className="flex items-center">
//                 <Badge variant="outline" className="mr-3 w-16 text-xs flex-shrink-0">
//                   {todo.label}
//                 </Badge>
//                 <span className="truncate block">{todo.title}</span>
//               </div>
//             </TableCell>
//             <TableCell className="w-[108.84px] text-center">
//               {todo.status === "Todo" ? (
//                 <Badge variant="default">{todo.status}</Badge>
//               ) : todo.status === "In Progress" ? (
//                 <Badge variant="secondary">{todo.status}</Badge>
//               ) : todo.status === "Done" ? (
//                 <Badge variant="doneTodo">{todo.status}</Badge>
//               ) : null}
//             </TableCell>
//             <TableCell className="w-[108.84px] text-center">
//               {todo.status === "Todo" ? (
//                 <Badge variant="default">{todo.status}</Badge>
//               ) : todo.status === "In Progress" ? (
//                 <Badge variant="secondary">{todo.status}</Badge>
//               ) : todo.status === "Done" ? (
//                 <Badge variant="doneTodo">{todo.status}</Badge>
//               ) : null}
//             </TableCell>
//             <TableCell className="w-[91.35px] text-center">
//               {todo.priority === "High" ? (
//                 <Badge variant="destructive">{todo.priority}</Badge>
//               ) : todo.priority === "Medium" ? (
//                 <Badge variant="secondary">{todo.priority}</Badge>
//               ) : todo.priority === "Low" ? (
//                 <Badge variant="default">{todo.priority}</Badge>
//               ) : (
//                 <Badge variant="default">{todo.priority}</Badge>
//               )}
//             </TableCell>
//             <TableCell className="w-[92.44px] text-right">
//               <TodosTableAction
//                 todo={todo}
//                 onEditClick={() => onEditClick(todo)}
//                 onDeleteSuccess={() => onDeleteSuccess(todo.id)}
//               />
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }

// export default TodoTable;