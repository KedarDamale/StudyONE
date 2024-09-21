import { useAuthStore } from '../store/authStore';

const Home = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <>
      <h1>{isAuthenticated && user ? `${user.name}'s home` : "My home"}</h1>
    </>
  );
};

export default Home;
