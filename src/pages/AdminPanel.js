import React, { useEffect, useState } from "react";
import { fetchAllUsers, adminDeleteUser } from "../services/blogService";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await fetchAllUsers();
    setUsers(data);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await adminDeleteUser(id);
    load();
  };

  return (
    <div className="container">
      <h2>Admin Panel - Users</h2>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td><button onClick={()=>remove(u._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}