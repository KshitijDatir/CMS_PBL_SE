import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate("/login", { replace: true }); // Redirect to login
    window.location.reload(); // Ensure state updates properly
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
