import { useAuthStore } from "../store/authStore";
import FactofTheDay from "../components/FactofTheDay_DashboardPage";

const Home = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <>
      {/*<h1 class="text-white">{isAuthenticated && user ? `${user.name}'s home` : "My home"}</h1>*/}
      <FactofTheDay />
    </>
  );
};

export default Home;
