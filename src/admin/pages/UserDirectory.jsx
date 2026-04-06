import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from 'react-redux'; // 1. Access the Auth State
import apiClient from "../../api/apiClient";
import { toast } from 'react-toastify';

const UserDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmationNode, setConfirmationNode] = useState(null); 
  const queryClient = useQueryClient();

  // 2. Get the current logged-in operative from Redux
  const { user: currentUser } = useSelector((state) => state.auth);

  const { data: users, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const response = await apiClient.get("/users");
      return response.data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, newRole }) => 
      apiClient.patch(`/users/${id}`, { role: newRole }),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      toast.success("User clearance updated");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      toast.error("Citizen wiped from the grid.");
      setConfirmationNode(null);
    }
  });

  const banMutation = useMutation({
    mutationFn: ({ id, isBanned }) => 
      apiClient.patch(`/users/${id}`, { status: isBanned ? 'Active' : 'Banned' }),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      toast.info("Citizen uplink status modified.");
      setConfirmationNode(null);
    }
  });

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="text-green-500 font-mono animate-pulse p-10 text-xs text-center uppercase tracking-[0.5em]">Scanning_Citizen_Nodes...</div>;

  return (
    <div className="animate-in fade-in duration-700 relative">
      
      {/* --- THE DECOMMISSION MODAL --- */}
      {confirmationNode && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-[#0a0a0a] border border-red-500/20 w-full max-w-md rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(239,68,68,0.1)] text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-2xl font-black">!</span>
            </div>
            
            <span className="text-red-500 font-mono text-[9px] tracking-[0.5em] uppercase block mb-2">
              Critical // {confirmationNode.type === 'ban' ? 'Access_Revocation' : 'Decommission_Sequence'}
            </span>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4">
              {confirmationNode.type === 'ban' ? 'ban user' : 'delete user'}
            </h2>
            <p className="text-white/40 text-[11px] font-mono leading-relaxed mb-8">
              Target: <span className="text-white font-bold">{confirmationNode.user.name}</span>. 
              {confirmationNode.type === 'ban' 
                ? " This will freeze the user access. They will be unable to initialize new orders until clearance is restored."
                : " This action is irreversible. All identity data and deployment logs will be permanently purged from the grid."}
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                   if(confirmationNode.type === 'ban') {
                     banMutation.mutate({ id: confirmationNode.user.id, isBanned: confirmationNode.user.status === 'Banned' });
                   } else {
                     deleteMutation.mutate(confirmationNode.user.id);
                   }
                }}
                className="w-full bg-red-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
              >
                Execute_{confirmationNode.type}
              </button>
              <button 
                onClick={() => setConfirmationNode(null)}
                className="w-full py-4 text-[9px] font-mono uppercase text-white/20 hover:text-white transition-colors"
              >
                Abort_Sequence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER SECTOR --- */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold uppercase italic tracking-[0.2em] text-white/40">user managment</h2>
          <p className="text-[10px] font-mono text-white/40 mt-2 uppercase tracking-widest">
            {users?.length} Authorized identities detected in the VOID.
          </p>
        </div>

        <input 
          type="text"
          placeholder="SEARCH_BY_NAME_OR_EMAIL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono text-white focus:border-green-500 outline-none transition-all placeholder:text-white/10"
        />
      </header>

      {/* --- CITIZEN TABLE --- */}
      <div className="overflow-hidden border border-white/5 rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] font-mono text-gray-400 uppercase tracking-[0.3em] bg-white/[0.01]">
              <th className="p-6">Users</th>
              <th className="p-6">Status</th>
              <th className="p-6">Activity</th>
              <th className="p-6 text-right">Protocol</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-mono uppercase">
            {filteredUsers?.map((user) => {
              // 3. THE SAFETY CHECK: Is this the person currently logged in?
              const isSelf = user.id === currentUser?.id;

              return (
                <tr key={user.id} className={`border-b border-white/[0.02] hover:bg-white/[0.03] transition-all ${isSelf ? 'bg-green-500/[0.02]' : ''}`}>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-white font-bold tracking-tighter">
                        {user.name} {isSelf && <span className="text-green-500 ml-2 text-[8px]">[YOU]</span>}
                      </span>
                      <span className="text-[9px] text-white/20 font-light">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                     <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest border
                        ${user.role === 'admin' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                        {user.role}
                      </span>
                      {user.status === 'Banned' && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
                          LOCKED
                        </span>
                      )}
                     </div>
                  </td>
                  <td className="p-6">
                    <span className="text-white/60">{user.orders?.length || 0} Deployments</span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      {/* Perms: Disabled for self to avoid demoting yourself */}
                      <button 
                        disabled={isSelf}
                        onClick={() => roleMutation.mutate({ id: user.id, newRole: user.role === 'admin' ? 'customer' : 'admin' })}
                        className={`text-[9px] font-black uppercase tracking-widest border px-4 py-2 rounded-lg transition-all
                          ${isSelf 
                            ? 'opacity-10 text-white/10 border-transparent cursor-not-allowed' 
                            : 'text-white/30 hover:text-white border-white/5'}`}
                      >
                        Perms
                      </button>

                      {/* Ban: Disabled for self */}
                      <button 
                        disabled={isSelf}
                        onClick={() => setConfirmationNode({ user, type: 'ban' })}
                        className={`text-[9px] font-black uppercase tracking-widest border px-4 py-2 rounded-lg transition-all
                          ${isSelf 
                            ? 'opacity-20 text-yellow-500/10 border-yellow-500/5 cursor-not-allowed' 
                            : 'text-yellow-500/30 hover:text-yellow-500 border-yellow-500/5'}`}
                      >
                        {isSelf ? 'LOCKED' : (user.status === 'Banned' ? 'Restore' : 'Ban')}
                      </button>

                      {/* Delete: Disabled for self */}
                      <button
                        disabled={isSelf}
                        onClick={() => setConfirmationNode({ user, type: 'banish' })}
                        className={`text-[9px] font-black uppercase tracking-widest border px-4 py-2 rounded-lg transition-all
                          ${isSelf 
                            ? 'opacity-20 text-red-500/10 border-red-500/5 cursor-not-allowed' 
                            : 'text-red-500/30 hover:text-red-500 border-red-500/5'}`}
                      >
                        {isSelf ? 'YOU' : 'delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDirectory;