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
        mutation.mutate({name:name, email:email,
            password:String(password)})

    };
    return(
        <div style={{maxWidth: '400px', margin: '2rem auto'}}>
            <h2>Create Acount</h2>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column', gap:'1rem'}}>
                <input type="text"
                placeholder="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
                />
                <input type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                />
                <input type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register;