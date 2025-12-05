import logo from './r_logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const token  = window.localStorage.getItem("accessToken")
    const name  = window.localStorage.getItem("username")

    const navigate = useNavigate();
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <header className="flex justify-between items-center px-10 shadow-md bg-gradient-to-br from-blue-50 to-blue-200">
        <div > <img src={logo} alt="Remindly Logo" className="w-16 h-16" /></div>
       {token ?
       ( <span className="text-gray-700">
      Hi, {name}
    </span>)
       : (
        <div className="space-x-6">
          <Link to="/signin" className="text-gray-700 hover:text-blue-600">Sign In</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Sign Up</Link>
        </div>)
}
      </header>

      <section className="flex flex-col justify-center items-center text-center h-[80vh] px-6 ">
        <img src={logo} alt="Remindly Logo" className="w-36 h-36 mb-2" />
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Never Forget Anything Again! ✨
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Remindly helps you set smart reminders for tasks, appointments, events, and everything that matters to you.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg"
        onClick={() => navigate("/reminder")}>
          Set a Reminder
        </button>
      </section>
    </div>
  );
}
