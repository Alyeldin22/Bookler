import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CustomButton from "../../components/Button/Button";
import plane from "../../assets/images/form-img.png";
import logo from "../../assets/images/blue-logo.png";
import { TextInput, Select, Card } from 'flowbite-react';

function SignUpPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const watchPassword = watch("password");

  const onSubmit = (data) => {
    console.log("Signup data:", data);
    
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    const existingUser = users.find(user => user.email === data.email);
    if (existingUser) {
      alert("User with this email already exists!");
      return;
    }

    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("User registered successfully:", data);

    navigate("/login");
  };

  return (
    <section className="signup flex min-h-screen">
      <div className="w-1/2 bg-cover bg-center" style={{backgroundImage: `url(${plane})`}}></div>
      
      <Card className="w-2/5 mx-auto my-auto p-8 text-center capitalize">
        <img src={logo} alt="logo" className="mb-12 mx-auto h-16"/>
        <h3 className="uppercase font-bold text-2xl mb-5">sign up</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <TextInput
            type="text"
            placeholder="Your Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-left text-red-500 text-xs">{errors.name.message}</p>
          )}

          {/* Email */}
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

          {/* Password */}
          <TextInput
            type="password"
            placeholder="Your Password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
              },
            })}
          />
          {errors.password && (
            <p className="text-left text-red-500 text-xs">{errors.password.message}</p>
          )}

          {/* Confirm Password */}
          <TextInput
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watchPassword || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-left text-red-500 text-xs">{errors.confirmPassword.message}</p>
          )}

          {/* Country */}
          <Select {...register("country", { required: "Country is required" })}>
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="MA">Morocco</option>
            <option value="EG">Egypt</option>
            <option value="GR">Greece</option>
          </Select>
          {errors.country && (
            <p className="text-left text-red-500 text-xs">{errors.country.message}</p>
          )}

          {/* Phone */}
          <TextInput
            type="tel"
            placeholder="Your Phone"
            maxLength="12"
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^\d{1,12}$/,
                message: "Enter a valid phone number (numbers only, max 12 digits)",
              },
            })}
          />
          {errors.phone && (
            <p className="text-left text-red-500 text-xs">{errors.phone.message}</p>
          )}

          <CustomButton 
            type="submit" 
            className="w-full bg-blue-600 text-white rounded-md mb-5 hover:bg-blue-700" 
            title="sign up" 
          />
        </form>

        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </section>
  );
}

export default SignUpPage;