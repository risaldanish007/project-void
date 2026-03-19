import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import apiClient from "../api/apiClient";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()


    const mutation = useMutation({
        mutationFn: async (credentials)=>{
            //logic to check if user already exists in db.json
            // const response = await apiClient.get(`/users?email=${credentials.email}&password=${credentials.password}`);
            const response = await apiClient.get(`/users?email=${encodeURIComponent(credentials.email)}`);
            return response.data;// json server return a array

        },
    
        onSuccess: (data)=>{
            console.log('Database Response: ', data);
            if(data.length > 0){
                const user = data[0];

                if(password.toString() === user.password.toString()){
                    dispatch(setCredentials(user));
                    const origin = location.state?.form?.pathname || "/";
                    navigate(origin);
                }else{
                    alert('wrong password')
                }
            }else{
                alert('not found');
            }
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("SENDING TO VOID:", { email, password }); // Look at this!
        mutation.mutate({ email, password });
    };

return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
            type="email" 
            placeholder="email" 
            value={email} // Add this
            onChange={(e) => setEmail(e.target.value)} 
            required 
            />
            <input
            type="password"
            placeholder="password"
            value={password} // Add this
            onChange={(e) => setPassword(e.target.value)}
            required 
            />
            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending?'Authentication...':'Login'}
            </button>
        </form>
    </div>
)
};
export default Login;