import FactofTheDay from "../components/FactofTheDay_DashboardPage";
import Alarms_DashboardPage from "../components/Alarms_DashboardPage";

const Home = () => {

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      
      <div className="mb-8">
        <FactofTheDay />
      </div>

      <div className="mt-4">
        <Alarms_DashboardPage />
      </div>
    </div>
  );
};

export default Home;
