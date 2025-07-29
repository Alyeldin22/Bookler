import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { setCurrentUser } from "../../store/UserSlice";
import CustomButton from "../../components/Button/Button";
import plane from "../../assets/images/form-img.png";
import logo from "../../assets/images/blue-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, Card } from 'flowbite-react';
import { signInWithGoogle, signInWithFacebook } from "../../services/apiService";
import { useState } from "react";

function LoginPage() {
  const {handleSubmit, formState: { errors }, register} = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const onSubmit = (data) => {
    setLoginError("");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === data.email);
    if (user) {
      const loggedInUser = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
      };
      dispatch(setCurrentUser(loggedInUser));
      navigate("/");
    } else {
      setLoginError("User not found. Please check your email or sign up.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      dispatch(setCurrentUser({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        provider: "google"
      }));
      navigate("/");
    } catch (error) {
      alert("Google sign-in failed: " + error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const user = await signInWithFacebook();
      dispatch(setCurrentUser({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        provider: "facebook"
      }));
      navigate("/");
    } catch (error) {
      alert("Facebook sign-in failed: " + error.message);
    }
  };

  return (
    <section className="login flex min-h-screen">
      <div className="w-1/2 bg-cover bg-center" style={{backgroundImage: `url(${plane})`}}></div>
      <Card className="w-2/5 mx-auto my-auto p-8 text-center capitalize">
        <img src={logo} alt="logo" className="mb-12 mx-auto h-16"/>
        <h3 className="uppercase font-bold text-2xl mb-5">login</h3>
        {loginError && (
          <div className="mb-4 text-red-600 font-semibold text-sm">{loginError}</div>
        )}
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
        <div className="flex flex-col gap-2 my-4">
          <button onClick={handleGoogleSignIn} className="w-full bg-red-500 text-white rounded-md py-2 hover:bg-red-600">Sign in with Google</button>
          <button onClick={handleFacebookSignIn} className="w-full bg-blue-800 text-white rounded-md py-2 hover:bg-blue-900">Sign in with Facebook</button>
        </div>
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