import { useState, ChangeEvent } from "react";
import { BottomWarning } from "../components/BottomWarning.tsx";
import { Button } from "../components/Button.tsx";
import { Heading } from "../components/Heading.tsx";
import { InputBox } from "../components/InputBox.tsx";
import { SubHeading } from "../components/SubHeading.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  // Handler for changing username
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // Handler for changing password
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Handler for signing up
  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/v1/signup", {
        username,
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", username);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle error appropriately (e.g., show error message)
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label="Sign up" />
          <SubHeading label="Enter your information to create an account" />
          <InputBox
            onChange={handleUsernameChange}
            placeholder="noneothis"
            label="Username"
          />
          <InputBox
            onChange={handlePasswordChange}
            placeholder="123456string"
            label="Password"
            // type="password"
          />
          <div className="pt-4">
            <Button onClick={handleSignup} label="Sign up" />
          </div>
          <BottomWarning label="Already have an account?" buttonText="Sign in" to="/signin" />
        </div>
      </div>
    </div>
  );
};
