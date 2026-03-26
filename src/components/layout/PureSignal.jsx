// import { useRef } from "react";

// export default function PureSiginal() {
//   const ref = useRef();

//   const handleMove = (e) => {
//     const rect = ref.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     ref.current.style.setProperty("--x", `${x}px`);
//     ref.current.style.setProperty("--y", `${y}px`);
//   };

//   return (
//     <div
//       ref={ref}
//       onMouseMove={handleMove}
//       className="hover-text text-center z-10"
//     >
//       <h1 className="text-6xl md:text-xl font-black tracking-tighter text-gray-400 uppercase italic">
//         Pure Signal
//       </h1>
//     </div>
//   );
// }