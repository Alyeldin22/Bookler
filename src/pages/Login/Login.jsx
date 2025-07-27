import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { setCurrentUser } from "../../store/UserSlice";
import CustomButton from "../../components/Button/Button";
import plane from "../../assets/images/form-img.png";
import logo from "../../assets/images/blue-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, Card } from 'flowbite-react';

function LoginPage() {
  const {handleSubmit, formState: { errors }, register} = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const onSubmit = (data) => {
    console.log("Login data:", data);
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === data.email);
    
    if (user) {
      // User exists, log them in
      const loggedInUser = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
      };
      dispatch(setCurrentUser(loggedInUser));
      console.log("User logged in:", loggedInUser);
      navigate("/");
    } else {
      // Create a guest user
      const fakeUser = {
        name: "Guest User",
        email: data.email,
      };
      dispatch(setCurrentUser(fakeUser));
      console.log("Guest user created:", fakeUser);
      navigate("/");
    }
  };

  return (
    <section className="login flex min-h-screen">
      <div className="w-1/2 bg-cover bg-center" style={{backgroundImage: `url(${plane})`}}></div>
      
      <Card className="w-2/5 mx-auto my-auto p-8 text-center capitalize">
        <img src={logo} alt="logo" className="mb-12 mx-auto h-16"/>
        <h3 className="uppercase font-bold text-2xl mb-5">login</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            type="email"
            placeholder="Your Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-left text-red-500 text-xs">{errors.email.message}</p>
          )}

          <TextInput
            type="password"
            placeholder="Your Password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <p className="text-left text-red-500 text-xs">{errors.password.message}</p>
          )}

          <CustomButton 
            type="submit" 
            className="w-full bg-blue-600 text-white rounded-md mb-5 hover:bg-blue-700" 
            title="login"
          />
        </form>

        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </section>
  );
}

export default LoginPage;