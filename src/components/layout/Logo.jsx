// const Logo = ({ isWhite = true }) => {
//   return (
//     <div className="relative inline-flex items-center justify-center wifit ">
      
//       {/* VOID (slightly smaller now) */}
//       <h1 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none select-none ${
//         isWhite ? 'text-white' : 'text-black'
//       }`}>
//         VOID
//       </h1>

//       {/* energy (manually positioned overlap) */}
//       <span className="absolute 
//                         drop-shadow-lg
//                        left-1/2 top-1/2 
//                        -translate-x-1/2 -translate-y-1/3
//                        text-3xl md:text-5xl 
//                        text-cyan-400 font-script 
//                        lowercase italic
//                        drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]
//                        z-10 pointer-events-none
//                        pb-9">
//         energy
//       </span>
      
//     </div>
//   );
// };

// export default Logo;

const Logo = ({ isWhite = true }) => {
  return (
    <div className="relative inline-flex items-center justify-center wifit group cursor-pointer">
      
      <h1 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none select-none transition-all duration-300 pb-1 ${
        isWhite ? 'text-white' : 'text-black'
      } group-hover:text-green-300 group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]`}>
        VOID
      </h1>

      <span className="absolute 
                       drop-shadow-lg
                       left-1/2 top-1/2 
                       -translate-x-1/2 -translate-y-1/3
                       text-3xl md:text-5xl 
                       text-green-400 font-script 
                       lowercase italic
                       transition-all duration-200
                       group-hover:scale-110
                       group-hover:drop-shadow-[0_0_30px_rgba(34,211,238,1)]
                       group-hover:text-cyan-200
                       group-hover:animate-pulse
                       z-10 pointer-events-none
                       pb-10">
        energy
      </span>
      
    </div>
  );
};

export default Logo;