import { useState } from "react";
import { registerUser } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { styles } from "../../utils/designSystem";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(form);
    navigate("/login");
  };

  return (
    <div className={styles.layout.page}>

      <div className={styles.card}>
        <h2 className={styles.heading}>Create Account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={handleChange} className={styles.input} />
          <input name="email" placeholder="Email" onChange={handleChange} className={styles.input} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className={styles.input} />

          <button className={styles.button}>Register</button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>

    </div>
  );
}

export default Register;