import { useSelector } from "react-redux";

const Profile = () => {
    const {user} = useSelector((state)=> state.auth); 
    //takes the data that we have save while login

return(
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-black mb-6">User Profile</h2>
      
      <div className="space-y-4">
        <div className="flex border-b pb-2">
            <span className="font-semibold w-32 text-gray-500">Name:</span>
                 {/* REMOVE THE LINK HERE, JUST SHOW THE TEXT */}
            <span className="text-black">{user?.name}</span>
        </div>
        
        <div className="flex border-b pb-2">
          <span className="font-semibold w-32 text-gray-500">Email:</span>
          <span className="text-black">{user?.email}</span>
        </div>

        <div className="flex border-b pb-2">
          <span className="font-semibold w-32 text-gray-500">Account ID:</span>
          <span className="text-gray-400 text-sm">{user?.id}</span>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          This data is coming directly from the **Redux Store**. Since you are logged in, the VOID remembers you.
        </p>
      </div>
    </div>
)
}

export default Profile;