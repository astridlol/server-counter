import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [token, setToken] = useState("");
  const [servers, setServers] = useState([]);

  useEffect(() => {
    const _token = Cookies.get("token");
    if (_token && _token.length > 5) {
      setToken(Cookies.get("token"));
      (async () => {
        if (!localStorage.getItem("servers")) {
          console.log(
            `Calling Discord API with the token: ${Cookies.get("token")}`
          );
          let discordInfo;
          try {
            discordInfo = (
              await axios.get(`https://discord.com/api/users/@me/guilds`, {
                // We specify the access token in the headers, to tell Discord that we want this specific users' information.
                headers: { Authorization: `Bearer ${Cookies.get("token")}` },
              })
            ).data;
          } catch (err) {
            console.error(err);
          }
          setServers(discordInfo);
        } else setServers(JSON.parse(localStorage.getItem("servers")));
      })();
    }
  }, []);

  useEffect(() => {
    if (servers && servers.length !== 0) {
      localStorage.setItem("servers", JSON.stringify(servers, null, 4));
    }
  }, [servers]);

  function loggedIn() {
    return (
      <>
        <div className={"flex align-center justify-center mt-[5rem]"}>
          <div className={"flex flex-col items-center"}>
            <h1 className={"text-3xl text-white"}>
              You are in {servers.length} servers!
            </h1>
          </div>
        </div>
      </>
    );
  }

  function loggedOut() {
    return <p>logged out</p>;
  }

  return token === "" ? loggedOut() : loggedIn();
}