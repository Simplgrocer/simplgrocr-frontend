"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Cookies from "universal-cookie";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const cookies = new Cookies();

  const router = useRouter();

  const setFormUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const setFormPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const login = () => {
    const requestBody = {
      username: username,
      password: password,
    };

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_BACKEND_PREFIX}/token/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json() as Promise<LoginApiResponse>;
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        cookies.set("access_token", data.auth_token, {
          path: "/",
          httpOnly: true,
          secure: true,
        });

        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        console.error("Error occurred while logging in:", error);
      });
  };

  return (
    <div className="container-sm">
      <form>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={setFormUsername}
            aria-describedby="usernameHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={setFormPassword}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={login}>
          Submit
        </button>
      </form>
    </div>
  );
}
