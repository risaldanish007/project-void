import { useState , useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //sending data to server using TSQ
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const mutation = useMutation({
            mutationFn: async (newUser)=>{
                const checkUser =  await apiClient.get(`/users?email=${newUser.email}`);
                

                if(checkUser.data.length>0){
                    throw new Error("this email already exists")
                }

                const response = await apiClient.post('/users',newUser)
                return response.data;
            },
            onSuccess:(data)=>{

                dispatch(setCredentials(data));

                alert('User created in The VOID!');

                navigate("/")
            },
            onError:(error)=>{
                alert(error.message || 'Error: the connection failed');
            }
        });
        

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("VOID REGISTRAION ATTEPMT: ", {name:name, email:email,
            password:String(password)});
        //tanStack Query Logics-----------
        mutation.mutate({
          name:name, 
          email:email,
          password:String(password),
          role:"user",
          cart: [],
          orders: []
        })

    };
    return (
  <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
    
    {/* glow background */}
    <div className="absolute w-[600px] h-[600px] bg-white/5 blur-3xl rounded-full -top-40 -left-40" />
    <div className="absolute w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full bottom-0 right-0" />

    <form
      onSubmit={handleSubmit}
      className="
        relative z-10
        w-[350px]
        p-8
        rounded-2xl
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        shadow-2xl
        flex flex-col gap-4
      "
    >
      <h2 className="text-white text-2xl font-semibold tracking-wide">
        Create Account
      </h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="
          bg-white/5
          border border-white/10
          rounded-lg
          px-4 py-3
          text-white
          placeholder-white/40
          outline-none
          focus:border-white/30
          transition
        "
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="
          bg-white/5
          border border-white/10
          rounded-lg
          px-4 py-3
          text-white
          placeholder-white/40
          outline-none
          focus:border-white/30
          transition
        "
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="
          bg-white/5
          border border-white/10
          rounded-lg
          px-4 py-3
          text-white
          placeholder-white/40
          outline-none
          focus:border-white/30
          transition
        "
        required
      />

      <button
        type="submit"
        className="
          mt-2
          bg-white/10
          hover:bg-white/20
          text-white
          py-3
          rounded-lg
          border border-white/10
          backdrop-blur-md
          transition
          active:scale-[0.98]
        "
      >
        Register
      </button>
    </form>
  </div>
);
}

export default Register;